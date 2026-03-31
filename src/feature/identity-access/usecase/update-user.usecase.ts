import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";

import { SelectMenu } from "@app/shared/utils/get-items-for-select-menu.usecase.response";
import { BadRequestException, ForbiddenException, Inject, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserRepository } from "../repositories/user.repository";
import { UpdateUserUsecaseRequest } from "./request/update-user.usecase.request";
import { UpdateUserUsecaseResponse } from "./response/update-user.usecase.response";
import { User } from "../entities/user.entity";
import { UserCredentialDbRepository } from "../repositories/db/user-credential.repository";
import { UserCredentialRepository } from "../repositories/user-credential.repository";
import { UserCredential } from "../entities/user-credential.entity";
import { IdGenerator } from "@app/shared/id-generator";
import { UserPoolService } from "@app/core/cache/user-pool.service";

export class UpdateUserUsecase implements Usecase<UpdateUserUsecaseRequest, UpdateUserUsecaseResponse> {
    constructor (
        @Inject(UserDbRepository) private readonly userRepository: UserRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
        @Inject(UserCredentialDbRepository)
        private userCredentialRepository?: UserCredentialRepository,
        @Inject(UserPoolService) private userPoolService?: UserPoolService,
    ) { }
    async execute(request: UpdateUserUsecaseRequest, requestContext?: RequestContext): Promise<Result<UpdateUserUsecaseResponse>> {
        const currentUser = requestContext?.getCurrentUser();
        const clientCode = currentUser?.clientCode;
        if (!clientCode) {
            throw new ForbiddenException('Missing client context');
        }
        const loggedInUser = currentUser.loginId;

        // if (loggedInUser === request.id) Result.createError(new ForbiddenException("User cannot modify itself!"));
        await this.validateSavedUser(request.id);
        await this.validateUserAttributeExists(request);

        const savedUser = await this.userRepository.findById(request.id);
        savedUser.roles.forEach(
            async (item) =>
                await this.userRepository.deleteUsersByRole(item.value, savedUser.id)
        );
        const user = new User();
        user.id = request.id;
        user.createdOn = savedUser.createdOn;
        user.employeeId = request.employeeId;
        user.roles = request.roles;
        user.userId = request.userId;
        user.userType='SERVICE';
        user.userName = request.userName;
        user.active = request.active;
        user.clientCode = clientCode;
        await this.userRepository.update(user);
        user.roles.forEach(async (role) => {
            const userByRole = new UserByRole();
            userByRole.roleId = role.value;
            userByRole.userId = user.id;
            userByRole.clientCode = clientCode;
            await this.userRepository.insertUserByRole(userByRole);
        });
        // if user role has changed then revoke session
        const userRoles = savedUser.roles;
        const userRoleIds = userRoles.map((role) => role.value);
        const RequestRoles = request.roles.map((role: any) => role.value);
        if (userRoleIds.length !== RequestRoles.length) {
            await this.handleUserSignoutAfterDelete(
                request,
                requestContext
            );

        }
        const isRoleChanged = RequestRoles.some(
            (role) => !userRoleIds.includes(role)
        );
        if (isRoleChanged) {
            await this.handleUserSignoutAfterDelete(request, requestContext);
        }


        const response = new UpdateUserUsecaseResponse(user.id);
        return Result.createSuccessWithMessage(response, "Update operation requested.");
    }

    private async validateSavedUser(id: string) {
        const savedUser = await this.userRepository.findById(id);
        if (!savedUser) {
            Result.createError(new NotFoundException("User not found"));
        }
        if (savedUser.deleted === true) {
            Result.createError(new NotFoundException("User already deleted"));
        }
        return savedUser;
    }
    private async validateUserAttributeExists(request: UpdateUserUsecaseRequest): Promise<boolean> {
        let userIdInUserExists: User, employeeIdInUserExists: User;
        userIdInUserExists = await this.userRepository.findByUserId(request.userId);
        if (userIdInUserExists && userIdInUserExists.id !== request.id) {
            Result.createErrorWithMessage(new NotAcceptableException(`User ID: ${ request.userId } already exists`), "Duplicate User ID");
        }

        return false;
    }


    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }

    private async handleUserSignoutAfterDelete(
        request: UpdateUserUsecaseRequest,
        requestContext: RequestContext
    ) {
        const userCredentials = await this.userCredentialRepository.findById(
            request.id
        );
        const newCredentials = new UserCredential();
        newCredentials.id = userCredentials.id;
        newCredentials.version = IdGenerator.generateId();
        await this.userCredentialRepository.update(newCredentials);
        this.userPoolService.revokeSession(
            request?.userId,
            requestContext.getCurrentUser().clientCode

        );
    }

    private async validateRoles(roles: Array<string>): Promise<SelectMenu[]> {
        let rolesList: SelectMenu[] = [];
        for (let i = 0; i < roles.length; i++) {
            const savedRole = await this.rolesRepository.findById(roles[i]);
            if (!roles) {
                throw new NotFoundException(`Cannot find roles`);
            }
            const rolesMenu = new SelectMenu(savedRole.title, savedRole.id);
            rolesList.push(rolesMenu);
        }
        return rolesList;
    }

}