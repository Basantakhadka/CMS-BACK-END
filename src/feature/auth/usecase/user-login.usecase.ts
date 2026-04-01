import { JwtStrategy } from "@app/core/auth/JwtStrategy";
import { UserPoolService } from "@app/core/cache/user-pool.service";
import { comparePassword } from "@app/core/hashing/hashing";
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { MFASTATUS } from "@app/feature/constants";
import { PasswordPolicy } from "@app/feature/identity-access/dtos/create-general-policy.dto";
import { UserCredential } from "@app/feature/identity-access/entities/user-credential.entity";
import { User } from "@app/feature/identity-access/entities/user.entity";
import { GeneralPolicyDbRepository } from "@app/feature/identity-access/repositories/db/general-policy.repository";
import { UserCredentialDbRepository } from "@app/feature/identity-access/repositories/db/user-credential.repository";
import { UserDbRepository } from "@app/feature/identity-access/repositories/db/user.repository";
import { GeneralPolicyRepository } from "@app/feature/identity-access/repositories/general-policy.repository";
import { UserCredentialRepository } from "@app/feature/identity-access/repositories/user-credential.repository";
import { UserRepository } from "@app/feature/identity-access/repositories/user.repository";
import { IdGenerator } from "@app/shared/id-generator";
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
import { ClientDbRepository } from "@app/feature/identity-access/repositories/db/client.repository";
import { ClientRepository } from "@app/feature/identity-access/repositories/client.repository";
import { Client } from "@app/feature/identity-access/entities/client.entity";

export class UserLoginUsecase
	implements Usecase<UserLoginUsecaseRequest, UserLoginUsecaseResponse> {

	private userData: User;

	constructor (
		@Inject(UserCredentialDbRepository)
		private userCredentialRepository: UserCredentialRepository,
		@Inject(UserDbRepository) private userRepository: UserRepository,
		@Inject(GeneralPolicyDbRepository)
		private readonly generalPolicyRepository: GeneralPolicyRepository,
		private readonly jwtStrategy: JwtStrategy,
		@Inject(UserPoolService)
		private userLoginCacheService: UserPoolService,
		private readonly userLoginService: UserLoginService,
		@Inject(ClientDbRepository)
		private readonly clientRepository: ClientRepository,
	) { }

	private async updateUserCredential(userCredential: Partial<UserCredential>) {
		await this.userCredentialRepository.update(userCredential);
	}

	private async getPasswordPolicy(): Promise<PasswordPolicy> {
		const generalPolicy = await this.generalPolicyRepository.findAll();
		return generalPolicy[0].passwordPolicy;
	}

	private async resolveClientContext(requestContext?: RequestContext): Promise<Client> {
		const clientCode = requestContext?.getCurrentUser()?.clientCode;
		if (!clientCode) {
			Result.createErrorWithMessage(
				new BadRequestException('Client header missing for login'),
				'Login Failed',
			);
		}
		const client = await this.clientRepository.findByCode(clientCode);
		if (!client) {
			Result.createErrorWithMessage(
				new BadRequestException('Client is not found'),
				'Login Failed',
			);
		}
		return client;
	}

	private async validateUser(request: UserLoginUsecaseRequest, clientCode: string) {
		const user = await this.userRepository.findByUserId(request.username);
		if (!user) {
			Result.createErrorWithMessage(
				new BadRequestException("Incorrect username or password"),
				"Login Failed"
			);
		}
		this.userData = user;
		if (user.clientCode && user.clientCode !== clientCode) {
			Result.createErrorWithMessage(
				new BadRequestException('User does not belong to the requested client'),
				'Login Failed',
			);
		}
		if (!user.active) {
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
			Result.createErrorWithMessage(
				new BadRequestException("Sorry! Unable to Login. No role assigned."),
				"Login Failed"
			);
		}
		const userCredential = await this.userCredentialRepository.findById(
			user.id
		);
		console.log('User credential fetched from database:', userCredential);
		if (!userCredential) {
			Result.createErrorWithMessage(
				new BadRequestException("Incorrect username or password"),
				"Login Failed"
			);
		}
		return { user, userCredential };
	}

	// private async validatePasswordExpiry(
	// 	userCredential: UserCredential,
	// 	passwordPolicy: PasswordPolicy
	// ) {
	// 	if (!passwordPolicy.passwordExpiry.neverExpires) {
	// 		const expiryTime = userCredential.expiryTime;
	// 		const currentTimestamp = Date.now();
	// 		if (expiryTime && +currentTimestamp > +expiryTime) {
	// 			Result.createErrorWithMessage(
	// 				new ForbiddenException(
	// 					"Your password has expired. Please set new password."
	// 				),
	// 				"PASSWORD_EXPIRED"
	// 			);
	// 		}
	// 	}
	// }
	// private async validateSuccessfulLoginAttempts(
	// 	user: User,
	// 	userCredential: UserCredential
	// ) {
	// 	const canAccess = await this.validateAndResetFailedLoginAttempts(
	// 		user,
	// 		userCredential
	// 	);
	// 	if (!canAccess) {

	// 		Result.createError(
	// 			new BadRequestException(
	// 				"Your account is locked. Please contact admin support."
	// 			)
	// 		);
	// 	}
	// 	await this.updateUserCredential({
	// 		id: user.id,
	// 		unsuccessfulLoginAttempts: 0,
	// 		loginAttemptsTimer: null,
	// 	});
	// }

	// private async validateAndResetFailedLoginAttempts(
	// 	user: User,
	// 	userCredential: UserCredential
	// ) {
	// 	const passwordPolicy = await this.getPasswordPolicy();
	// 	const wrongPasswordCountBasis =
	// 		passwordPolicy.failedLoginAttempts.lockUserCount;
	// 	const currentTimestampInHours = Date.now() / 3600000;
	// 	if (!userCredential.loginAttemptsTimer) {
	// 		return !userCredential.blocked;
	// 	}
	// 	const userLoginAttemptsTimestampInHours =
	// 		+userCredential.loginAttemptsTimer / 3600000;
	// 	const resetLoginAttemptsDurationInHours = 24;
	// 	const shouldResetLoginAttempts =
	// 		currentTimestampInHours - userLoginAttemptsTimestampInHours >
	// 		resetLoginAttemptsDurationInHours;
	// 	if (
	// 		!passwordPolicy?.failedLoginAttempts?.active ||
	// 		wrongPasswordCountBasis === "cumulative" ||
	// 		!shouldResetLoginAttempts
	// 	) {
	// 		return !userCredential.blocked;
	// 	}
	// 	await this.userCredentialRepository.update({
	// 		id: user.id,
	// 		unsuccessfulLoginAttempts: 0,
	// 		loginAttemptsTimer: null,
	// 		blocked: false
	// 	});
	// 	return true;
	// }

	private async handleIncorrectLoginAttempts(
		passwordPolicy: PasswordPolicy,
		user: User,
		userCredential: UserCredential
	) {
		// await this.validateAndResetFailedLoginAttempts(user, userCredential);
		const updatedUserCredential = await this.userCredentialRepository.findById(
			user.id
		);
		if (updatedUserCredential.blocked) {

			Result.createError(
				new BadRequestException(
					"Your account is locked. Please contact admin support."
				)
			);
		}
		let unsuccessfulLoginAttempts =
			updatedUserCredential.unsuccessfulLoginAttempts || 0

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
		// await this.validateSuccessfulLoginAttempts(user, userCredential);
		// await this.validatePasswordExpiry(userCredential, passwordPolicy);
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

		const client = await this.resolveClientContext(requestContext);
		const clientCode = client.clientCode;
		console.log('Client resolved for login:', clientCode);

		const { user, userCredential } = await this.validateUser(request, clientCode);

		

		if (
			(await this.userLoginCacheService.isUserSessionActive(
				user.userId,
				clientCode
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
		const sessionId = IdGenerator.generateId("v4");

		if ( enforcePasswordChange) {

			const payload = {
				userId: user.userId,
				fullName: user.userName,
				username: user.userId,
				version: userCredential.version,
				schema: requestContext.getCurrentUser().schema,
				clientCode: clientCode,
				enforcePasswordChange,
				MFAStatus:
					password?.toUpperCase() !== "MIGRATED"
						? MFASTATUS.PENDING
						: MFASTATUS.NOTSET,
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
				enforcePasswordChange,
				client: {
					code:clientCode,
					name: client.clientName,
				},
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
			client,
		);
		const response = new UserLoginUsecaseResponse(loginResponse);
		return Result.createSuccess(response);
	}


}
