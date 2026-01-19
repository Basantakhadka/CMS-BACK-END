
import { JwtStrategy } from "../../../core/auth/JwtStrategy";
import { UserPoolService } from "../../../core/cache/user-pool.service"

import { comparePassword } from "../../../core/hashing/hashing";
import { RequestContext } from "../../../core/middleware/request_context";
import { Usecase } from "../../../core/usecase/usecase";
import { Result } from "../../../feature/common/result";


// Update the import path below to the correct location of constants.ts
import { MFASTATUS } from "../../constants";
import { PasswordPolicy } from "../../identity-access/dtos/create-general-policy.dto";
import { UserCredential } from "../../identity-access/entities/user-credential.entity";
import { User } from "../../identity-access/entities/user.entity";
import { GeneralPolicyDbRepository } from "../../identity-access/repositories/db/general-policy.repository";
import { UserCredentialDbRepository } from "../../identity-access/repositories/db/user-credential.repository";
import { UserDbRepository } from "../../identity-access/repositories/db/user.repository";
import { GeneralPolicyRepository } from "../../identity-access/repositories/general-policy.repository";
import { UserCredentialRepository } from "../../identity-access/repositories/user-credential.repository";
import { UserRepository } from "../../identity-access/repositories/user.repository";
// import { SystemConfigurationDbRepository } from "../../../feature/system-configuration/repositories/db/system-configuration.repository";
// import { SystemConfigurationDbRepository } from "../../../feature/system-configuration/repositories/db/system-configuration.repository";
// import { SystemConfigurationRepository } from "@app/feature/system-configuration/repositories/system-configuration.repository";
// import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
// import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { IdGenerator } from "../../../shared/id-generator";
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	NotFoundException,
} from "@nestjs/common";
import { UserLoginService } from "../services/user-login.service";
import { UserLoginUsecaseRequest } from "./request/user-login.usecase.request";
import { UserLoginUsecaseResponse } from "./response/user-login.usecase.response";
import { JwtSignOptions } from "@nestjs/jwt";
// import { IMailOptions } from "CMS-BACK-END/src/shared/mailer/mailer-interfaces/interfaces";
// import { SystemConfigurationEntity } from "@app/feature/system-configuration/entities/system-configuration.entity";
// import { EmailService } from "CMS-BACK-END/src/core/notification/notification.service";
import { GeneralPolicy } from "src/feature/identity-access/entities/general-policy.entity";

export class UserLoginUsecase
	implements Usecase<UserLoginUsecaseRequest, UserLoginUsecaseResponse>
{
	// private systemConfiguration: SystemConfigurationEntity;

	private userData: User;

	constructor(
		@Inject(UserCredentialDbRepository)
		private userCredentialRepository: UserCredentialRepository,
		@Inject(UserDbRepository) private userRepository: UserRepository,
		@Inject(GeneralPolicyDbRepository)
		private readonly generalPolicyRepository: GeneralPolicyRepository,
		private readonly jwtStrategy: JwtStrategy,
		// @Inject(SystemConfigurationDbRepository)
		// private readonly systemConfigurationRepository: SystemConfigurationRepository,
		// @Inject(WorkflowGroupDbRepository)
		// public workflowDetailsRepository: WorkflowGroupRepository,
		@Inject(UserPoolService)
		private userLoginCacheService: UserPoolService,
		// @Inject(EmailService)
		// private readonly emailService: EmailService,
		private readonly userLoginService: UserLoginService
	) {}

	private async updateUserCredential(userCredential: Partial<UserCredential>) {
		await this.userCredentialRepository.update(userCredential);
	}

	private async getPasswordPolicy(): Promise<PasswordPolicy> {
		const generalPolicy = await this.generalPolicyRepository.findAll();
		return generalPolicy[0].passwordPolicy;
	}

	private async validateUser(request: UserLoginUsecaseRequest) {
		const user = await this.userRepository.findByUserId(request.username);
		if (!user) {
			Result.createErrorWithMessage(
				new BadRequestException("Incorrect username or password"),
				"Login Failed"
			);
		}
		this.userData = user;
		if (!user.active) {
			// this.sendFailedLoginAttemptEmail(
			// 	"Sorry! User is Disabled. Unable to Login. Please contact your Administration."
			// );
			Result.createErrorWithMessage(
				new BadRequestException(
					"Sorry! User is Disabled. Unable to Login. Please contact your Administration."
				),
				"Login Failed"
			);
		}
		const usersRolesInUsersByRole =
			await this.userRepository.findSavedUsersRoles(user.id);
		if (usersRolesInUsersByRole.length == 0) {
			// this.sendFailedLoginAttemptEmail(
			// 	"Sorry! Unable to Login. No role assigned."
			// );
			Result.createErrorWithMessage(
				new BadRequestException("Sorry! Unable to Login. No role assigned."),
				"Login Failed"
			);
		}
		const userCredential = await this.userCredentialRepository.findById(
			user.id
		);
		if (!userCredential) {
			// this.sendFailedLoginAttemptEmail(
			// 	"Sorry! Unable to Login. No credentials found."
			// );
			Result.createErrorWithMessage(
				new BadRequestException("Incorrect username or password"),
				"Login Failed"
			);
		}
		return { user, userCredential };
	}

	private async validatePasswordExpiry(
		userCredential: UserCredential,
		passwordPolicy: PasswordPolicy
	) {
		if (!passwordPolicy.passwordExpiry.neverExpires) {
			const expiryTime = userCredential.expiryTime;
			const currentTimestamp = Date.now();
			if (expiryTime && +currentTimestamp > +expiryTime) {
				// this.sendFailedLoginAttemptEmail(
				// 	"Your password has expired. Please set new password."
				// );
				Result.createErrorWithMessage(
					new ForbiddenException(
						"Your password has expired. Please set new password."
					),
					"PASSWORD_EXPIRED"
				);
			}
		}
	}
	private async validateSuccessfulLoginAttempts(
		user: User,
		userCredential: UserCredential
	) {
		const canAccess = await this.validateAndResetFailedLoginAttempts(
			user,
			userCredential
		);
		if (!canAccess) {
			// this.sendFailedLoginAttemptEmail(
			// 	"our account is locked. Please contact admin suppor"
			// );

			Result.createError(
				new BadRequestException(
					"Your account is locked. Please contact admin support."
				)
			);
		}
		await this.updateUserCredential({
			id: user.id,
			unsuccessfulLoginAttempts: 0,
			loginAttemptsTimer: null,
		});
	}

	private async validateAndResetFailedLoginAttempts(
		user: User,
		userCredential: UserCredential
	) {
		const passwordPolicy = await this.getPasswordPolicy();
		const wrongPasswordCountBasis =
			passwordPolicy.failedLoginAttempts.lockUserCount;
		const currentTimestampInHours = Date.now() / 3600000;
		if (!userCredential.loginAttemptsTimer) {
			return !userCredential.blocked;
		}
		const userLoginAttemptsTimestampInHours =
			+userCredential.loginAttemptsTimer / 3600000;
		const resetLoginAttemptsDurationInHours = 24;
		const shouldResetLoginAttempts =
			currentTimestampInHours - userLoginAttemptsTimestampInHours >
			resetLoginAttemptsDurationInHours;
		if (
			!passwordPolicy?.failedLoginAttempts?.active ||
			wrongPasswordCountBasis === "cumulative" ||
			!shouldResetLoginAttempts
		) {
			return !userCredential.blocked;
		}
		await this.userCredentialRepository.update({
			id: user.id,
			unsuccessfulLoginAttempts: 0,
			loginAttemptsTimer: null,
			blocked: false,
		});
		return true;
	}

	private async handleIncorrectLoginAttempts(
		passwordPolicy: PasswordPolicy,
		user: User,
		userCredential: UserCredential
	) {
		const enabledUnsuccessfulAttempts =
			passwordPolicy.failedLoginAttempts.active;
		const userLoginAttemptsLimit = +passwordPolicy.failedLoginAttempts.limits;
		await this.validateAndResetFailedLoginAttempts(user, userCredential);
		const updatedUserCredential = await this.userCredentialRepository.findById(
			user.id
		);
		if (updatedUserCredential.blocked) {
			// this.sendFailedLoginAttemptEmail(
			// 	"our account is locked. Please contact admin suppor"
			// );

			Result.createError(
				new BadRequestException(
					"Your account is locked. Please contact admin support."
				)
			);
		}
		let unsuccessfulLoginAttempts =
			updatedUserCredential.unsuccessfulLoginAttempts || 0;

		if (enabledUnsuccessfulAttempts) {
			unsuccessfulLoginAttempts += 1;
			if (unsuccessfulLoginAttempts >= userLoginAttemptsLimit) {
				await this.blockUser(user);
			}

			await this.updateUserCredential({
				id: user.id,
				unsuccessfulLoginAttempts,
				loginAttemptsTimer: Date.now().toString(),
			});
			const attemptsLeft =
				userLoginAttemptsLimit - unsuccessfulLoginAttempts + 1;
			const message = `Incorrect username or password. You have ${attemptsLeft} attempts left.`;
			// this.sendFailedLoginAttemptEmail(
			// 	`Incorrect username or password. You have ${attemptsLeft} attempts left.`
			// );

			Result.createErrorWithMessage(
				new BadRequestException(message),
				"Login Failed"
			);
		}
		// this.sendFailedLoginAttemptEmail(`Incorrect username or password`);

		Result.createErrorWithMessage(
			new BadRequestException("Incorrect username or password"),
			"Login Failed"
		);
	}

	private async blockUser(user: User) {
		await this.updateUserCredential({
			id: user.id,
			blocked: true,
		});
	}

	private async validateUserLogin(
		isPasswordCorrect: boolean,
		userCredential: UserCredential,
		user: User
	) {
		const passwordPolicy = await this.getPasswordPolicy();
		if (!isPasswordCorrect) {
			await this.handleIncorrectLoginAttempts(
				passwordPolicy,
				user,
				userCredential
			);
		}
		await this.validateSuccessfulLoginAttempts(user, userCredential);
		await this.validatePasswordExpiry(userCredential, passwordPolicy);
	}

	private async validatePassword(
		password: string,
		hashedPassword: string,
		userId: string,
		userName: string
	) {
		return await comparePassword(password, hashedPassword, userId, userName);
	}

	async execute(
		request: UserLoginUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<UserLoginUsecaseResponse>> {
		// const systemConfigurations =
		// 	await this.systemConfigurationRepository.findAll();
		// this.systemConfiguration = systemConfigurations[0];
		const { user, userCredential } = await this.validateUser(request);

		if (
			(await this.userLoginCacheService.isUserSessionActive(
				user.userId,
				requestContext.getCurrentUser().institutionCode
			)) &&
			user.userType !== "SERVICE"
		) {
			let msg = "Already logged in from another device.";
			return Result.createErrorWithMessage(new BadRequestException(msg), msg);
		}

		const { password, enforcePasswordChange } = userCredential;
		if (password?.toUpperCase() !== "MIGRATED") {
			const isPasswordCorrect = await this.validatePassword(
				request.password,
				password,
				user.id,
				user.userId
			);
			await this.validateUserLogin(isPasswordCorrect, userCredential, user);
		}
		const policy = await this.generalPolicyRepository.findAll();
		const isMFAEnabled = policy[0]?.usersMfa && policy[0]?.usersMfa.otp.active;
		const MFAStatus = isMFAEnabled ? MFASTATUS.ACTIVE : MFASTATUS.INACTIVE;
		const sessionId = IdGenerator.generateId("v4");

		if (isMFAEnabled || enforcePasswordChange) {
			// if (!systemConfigurations?.length) {
			// 	Result.createError(
			// 		new NotFoundException("Invalid Credentials")
			// 	);
			// }
			// const configKey =
			// 	systemConfigurations[0]?.configKey &&
			// 	JSON.parse(systemConfigurations[0].configKey);
			// if (!configKey) {
			// 	Result.createError(
			// 		new NotFoundException("Config key not found in system configuration")
			// 	);
			// }
			const payload = {
				userId: user.userId,
				fullName: user.userName,
				username: user.userId,
				version: userCredential.version,
				institutionCode: requestContext.getCurrentUser().institutionCode,
				schema: requestContext.getCurrentUser().schema,
				enforcePasswordChange,
				MFAStatus:
					password?.toUpperCase() !== "MIGRATED"
						? MFASTATUS.PENDING
						: MFASTATUS.NOTSET,
				// institutionType: configKey.institutionType,
				sessionId,
			};

			const jwtId = IdGenerator.generateId("v4");

			const jwtSignOption: JwtSignOptions = {
				subject: user.id,
				jwtid: jwtId,
			};

			const accessToken = this.jwtStrategy.sign(payload, jwtSignOption);
			const response = new UserLoginUsecaseResponse({
				accessToken,
				// institutionType: configKey.institutionType,
				// institutionName: configKey?.institutionName,
				enforcePasswordChange,
				MFAStatus:
					password?.toUpperCase() !== "MIGRATED"
						? MFASTATUS.PENDING
						: MFASTATUS.NOTSET,
			});
			return Result.createSuccess(response);
		}

		const loginResponse = await this.userLoginService.execute(
			user,
			userCredential,
			requestContext,
			enforcePasswordChange,
			MFAStatus
		);
		const response = new UserLoginUsecaseResponse(loginResponse);
		return Result.createSuccess(response);
	}

	// async sendFailedLoginAttemptEmail(message: string) {
	// 	const passwordPolicy = await this.getPasswordPolicy();
	// 	if (!passwordPolicy.shouldSendEmailOnFailedLogin) {
	// 		return;
	// 	}

	// 	const configKey = JSON.parse(this.systemConfiguration?.configKey);
	// 	const operatorLargeLogo = configKey?.institutionLargeLogo;

	// 	const replaceValues = {
	// 		name: this.userData.userName,
	// 		message: message,
	// 		institutionLargeLogo: operatorLargeLogo,
	// 	};

	// 	const mailOptions: IMailOptions = {
	// 		subject: `Login Attempt Failed`,
	// 		to: this.userData.userId,
	// 		templateName: "failed-login-attempt",
	// 		replace: replaceValues,
	// 	};

	// 	return this.emailService.sendEmail({
	// 		emailProperties: mailOptions,
	// 	});
	// }
}
