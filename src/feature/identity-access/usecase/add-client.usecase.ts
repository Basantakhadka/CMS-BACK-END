import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { GeneralPolicy } from "@app/feature/identity-access/entities/general-policy.entity";
import { Client } from "@app/feature/identity-access/entities/client.entity";
import { Role } from "@app/feature/identity-access/entities/roles.entity";
import { User, UserByRole } from "@app/feature/identity-access/entities/user.entity";
import { UserCredential } from "@app/feature/identity-access/entities/user-credential.entity";
import { GeneralPolicyDbRepository } from "@app/feature/identity-access/repositories/db/general-policy.repository";
import { RolesDbRepository } from "@app/feature/identity-access/repositories/db/roles.repository";
import { UserCredentialDbRepository } from "@app/feature/identity-access/repositories/db/user-credential.repository";
import { UserDbRepository } from "@app/feature/identity-access/repositories/db/user.repository";
import { ClientDbRepository } from "@app/feature/identity-access/repositories/db/client.repository";
import { ClientRepository } from "../repositories/client.repository";
import { GeneralPolicyRepository } from "../repositories/general-policy.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserCredentialRepository } from "../repositories/user-credential.repository";
import { UserRepository } from "../repositories/user.repository";
import { AddClientUsecaseRequest } from "./request/add-client.usecase.request";
import { AddClientUsecaseResponse } from "./response/add-client.usecase.response";
import { hashPassword } from "@app/core/hashing/hashing";
import { IdGenerator } from "@app/shared/id-generator";
import { LabelValuePair } from "@app/shared/entities/label-value-pair.view";
import {
    FailedLoginAttempt,
    MultiFactorAuthentication,
    OTPSetting,
    PasswordExpiry,
    PasswordHistory,
    PasswordPolicy,
} from "../dtos/create-general-policy.dto";
import {
    ConflictException,
    Inject,
} from "@nestjs/common";

export class AddClientUsecase
    implements Usecase<AddClientUsecaseRequest, AddClientUsecaseResponse> {
    private static readonly DEFAULT_ADMIN_PASSWORD = "Test@123";
    private static readonly SYSTEM_ACTOR: LabelValuePair = {
        label: "System Bootstrap",
        value: "system",
    };

    constructor(
        @Inject(ClientDbRepository)
        private readonly clientRepository: ClientRepository,
        @Inject(UserDbRepository)
        private readonly userRepository: UserRepository,
        @Inject(UserCredentialDbRepository)
        private readonly userCredentialRepository: UserCredentialRepository,
        @Inject(RolesDbRepository)
        private readonly rolesRepository: RolesRepository,
        @Inject(GeneralPolicyDbRepository)
        private readonly generalPolicyRepository: GeneralPolicyRepository,
    ) { }

    async execute(
        request: AddClientUsecaseRequest,
        _requestContext?: RequestContext,
    ): Promise<Result<AddClientUsecaseResponse>> {
        if (!request?.clientCode || !request?.clientName) {
            throw new ConflictException('Client code and name are required');
        }

        const existingClient = await this.clientRepository.findByCode(request.clientCode);
        if (existingClient) {
            throw new ConflictException(
                `Client with code ${request.clientCode} already exists`,
            );
        }

        const entity = new Client();
        entity.clientCode = request.clientCode.trim();
        entity.clientName = request.clientName.trim();

        const persisted = await this.clientRepository.insert(entity);
        const persistedCode = persisted?.clientCode ?? entity.clientCode;

        await this.bootstrapClientDefaults(persistedCode, entity.clientName.trim());

        return Result.createSuccessWithMessage(
            new AddClientUsecaseResponse(persistedCode),
            'Client created successfully',
        );
    }

    private async bootstrapClientDefaults(clientCode: string, clientName: string) {
        const [roleId] = await Promise.all([
            this.createDefaultRole(clientCode, clientName),
            this.createDefaultGeneralPolicy(clientCode),
        ]);
        const adminUser = await this.createDefaultAdminUser(clientCode, clientName, roleId);
        await Promise.all([
            this.createDefaultCredentials(adminUser, clientCode),
            this.linkUserRole(adminUser.id, roleId, clientCode),
        ]);
    }

    private async createDefaultRole(clientCode: string, clientName: string) {
        const roleId = IdGenerator.generateId("v4");
        const role = new Role();
        role.id = roleId;
        role.clientCode = clientCode;
        role.title = `${clientName || clientCode} Admin`;
        role.permissions = this.getDefaultPermissions();
        role.active = true;
        role.deleted = false;
        role.createdOn = new Date().toISOString();
        role.lastModifiedOn = role.createdOn;
        role.createdBy = AddClientUsecase.SYSTEM_ACTOR;
        role.lastModifiedBy = AddClientUsecase.SYSTEM_ACTOR;
        role.deletedBy = null;
        role.deletedOn = null;
        await this.rolesRepository.insert(role);
        return roleId;
    }

    private async createDefaultGeneralPolicy(clientCode: string) {
        const generalPolicy = new GeneralPolicy();
        generalPolicy.id = IdGenerator.generateId("v4");
        generalPolicy.clientCode = clientCode;
        generalPolicy.active = true;
        generalPolicy.usersMfa = this.buildMfaSetting(false);
        generalPolicy.merchantsMfa = this.buildMfaSetting(false);
        generalPolicy.passwordPolicy = this.buildPasswordPolicy();
        generalPolicy.usersOtpSetting = this.buildOtpSetting();
        generalPolicy.merchantsOtpSetting = this.buildOtpSetting();
        generalPolicy.merchantSignupOtpSetting = this.buildOtpSetting();
        await this.generalPolicyRepository.insert(generalPolicy);
    }

    private buildPasswordPolicy(): PasswordPolicy {
        const policy = new PasswordPolicy();
        const minLength = 6;
        const maxLength = 12;
        const expiryDays = 90;
        policy.minLength = minLength;
        policy.maxLength = maxLength;
        policy.expiryDays = expiryDays;
        policy.requireNumbers = true;
        policy.requireLowercase = true;
        policy.requireUppercase = true;
        policy.requireSpecialChars = false;
        policy.minimumLength = `${minLength}`;
        policy.maximumLength = `${maxLength}`;
        policy.minimumUppercase = policy.requireUppercase ? "1" : "0";
        policy.minimumNumbers = policy.requireNumbers ? "1" : "0";
        policy.minimumSpecialCharacters = policy.requireSpecialChars ? "1" : "0";
        policy.dissimilarToUserId = true;
        policy.shouldSendEmailOnFailedLogin = true;
        policy.passwordHistory = Object.assign(new PasswordHistory(), {
            active: true,
            limits: "5",
        });
        policy.failedLoginAttempts = Object.assign(new FailedLoginAttempt(), {
            active: true,
            limits: "5",
            lockUserCount: "perDay",
        });
        policy.passwordExpiry = Object.assign(new PasswordExpiry(), {
            neverExpires: false,
            limits: `${expiryDays}`,
            units: "perDay",
        });
        return policy;
    }

    private buildOtpSetting(): OTPSetting {
        const otp = new OTPSetting();
        otp.requestPerDay = "5";
        otp.expiryTime = "5";
        otp.resendLimit = "3";
        otp.resendInterval = "1";
        return otp;
    }

    private buildMfaSetting(active: boolean): MultiFactorAuthentication {
        const mfa = new MultiFactorAuthentication();
        mfa.otp.active = active;
        mfa.otp.channels = active ? "EMAIL" : null;
        return mfa;
    }

    private async createDefaultAdminUser(clientCode: string, clientName: string, roleId: string) {
        const userId = IdGenerator.generateId("v4");
        const adminUser = new User();
        adminUser.id = userId;
        adminUser.userId = "admin@yopmail.com";
        adminUser.userName = `${clientName || clientCode} Administrator`;
        adminUser.employeeId = `${clientCode}-ADMIN`;
        adminUser.roles = [
            { label: `${clientName || clientCode} Admin`, value: roleId },
        ];
        adminUser.createdBy = AddClientUsecase.SYSTEM_ACTOR;
        adminUser.lastModifiedBy = AddClientUsecase.SYSTEM_ACTOR;
        adminUser.createdOn = new Date().toISOString();
        adminUser.lastModifiedOn = adminUser.createdOn;
        adminUser.deleted = false;
        adminUser.deletedBy = null;
        adminUser.deletedOn = null;
        adminUser.active = true;
        adminUser.userType = "INTERNAL";
        adminUser.clientCode = clientCode;
        await this.userRepository.insert(adminUser);
        return adminUser;
    }

    private async createDefaultCredentials(user: User, clientCode: string) {
        const credential = new UserCredential();
        credential.id = user.id;
        credential.clientCode = clientCode;
        credential.version = IdGenerator.generateId();
        credential.password = await hashPassword(
            AddClientUsecase.DEFAULT_ADMIN_PASSWORD,
            user.id,
            user.userId,
        );
        credential.enforcePasswordChange = true;
        credential.expiryTime = null;
        credential.loginAttemptsTimer = null;
        credential.passwordHistory = [];
        credential.unsuccessfulLoginAttempts = 0;
        credential.blocked = false;
        await this.userCredentialRepository.insert(credential);
    }

    private async linkUserRole(userId: string, roleId: string, clientCode: string) {
        const userByRole = new UserByRole();
        userByRole.roleId = roleId;
        userByRole.userId = userId;
        userByRole.clientCode = clientCode;
        await this.userRepository.insertUserByRole(userByRole);
    }

    private getDefaultPermissions(): string[] {
        return [
            "dashboard",
            "dashboard:contracts",
            "dashboard:alerts",
            "contracts:search",
            "contracts:list",
            "contracts:summary",
            "contracts:table",
            "contracts:add",
            "contracts:delete",
            "contracts:update",
            "contracts:view",
            "alerts::list",
            "alerts::add",
            "alerts::update",
            "alerts::delete",
            "alerts::edit",
            "iam:general:passwordPolicy",
            "iam:general:multiFactorAuthentication",
            "iam:users:list",
            "iam:users:add",
            "iam:users:update",
            "iam:users:edit",
            "iam:roles:list",
            "iam:roles:add",
            "iam:roles:update",
            "iam:roles:delete",
            "iam:roles:edit",
            "iam:users:delete"
        ];
    }
}
