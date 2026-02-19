import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import {
	Inject,
	Logger,
	NotAcceptableException,
} from "@nestjs/common";

import { User } from "../entities/user.entity";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserRepository } from "../repositories/user.repository";
import { AddUserUsecaseRequest } from "./request/add-user.usecase.request";
import { AddUserUsecaseResponse } from "./response/add-user.usecase.response";
import { UserCredentialDbRepository } from "../repositories/db/user-credential.repository";
import { IdGenerator } from "@app/shared/id-generator";
import { UserCredential } from "../entities/user-credential.entity";
import { hashPassword } from "@app/core/hashing/hashing";
import { UserCredentialRepository } from "../repositories/user-credential.repository";
import { EmailService } from "@app/feature/notification/notification.service";

export class AddUserUsecase
	implements Usecase<AddUserUsecaseRequest, AddUserUsecaseResponse> {
	private readonly logger = new Logger(AddUserUsecase.name);

	constructor (
		@Inject(UserDbRepository)
		private readonly userRepository: UserRepository,

		@Inject(UserCredentialDbRepository)
		private readonly userCredentialRepository: UserCredentialRepository,

		@Inject(RolesDbRepository)
		private readonly rolesRepository: RolesRepository,
		@Inject(EmailService) private emailService?: EmailService
	) { }

	async execute(
		request: AddUserUsecaseRequest,
		requestContext?: RequestContext,
	): Promise<Result<AddUserUsecaseResponse>> {

		const loggedInUser = requestContext.getCurrentUser().loginId;
		const user = await this.userRepository.findById(loggedInUser);
		if(user.userId ===loggedInUser){
			throw new NotAcceptableException(
				`user already exists with the same user id ${ request.userId }`,
			);
		}

		// 1️⃣ Validate duplicates
		await this.validateUserAttributeExists(request);

		// 2️⃣ Create User
		const userId = IdGenerator.generateId("v4");

		const users = new User();
		users.id = userId;
		users.userId = request.userId;
		users.userName = request.userName;
		users.employeeId = request.employeeId;
		users.roles = request.roles;
		users.active = true;
		users.deleted = false;
		users.createdBy = { label: "SYSTEM", value: loggedInUser };
		users.createdOn = new Date();

		await this.userRepository.insert(users);
		const randomPassword: string = this.generatePassword();

		// 3️⃣ Create User Credential
		const credential = new UserCredential();
		credential.id = userId; // 🔑 SAME ID (important)
		credential.password = await hashPassword(randomPassword, users.id, users.userId);
		credential.version = IdGenerator.generateId("4"),
			credential.enforcePasswordChange = true;
		credential.unsuccessfulLoginAttempts = 0;
		credential.loginAttemptsTimer = null,
			credential.unsuccessfulLoginAttempts = null,
			credential.blocked = false;
		credential.passwordHistory = [];
		credential.expiryTime = null;


		await this.userCredentialRepository.insert(credential);
		await this.sendWelcomeEmail(users, randomPassword);


		// 4️⃣ Assign roles
		users?.roles?.forEach(async (role) => {
			const userByRole = new UserByRole();
			userByRole.roleId = role.value;
			userByRole.userId = users.id;
			await this.userRepository.insertUserByRole(userByRole);
		});

		// 5️⃣ Response
		return Result.createSuccessWithMessage(
			new AddUserUsecaseResponse(),
			"User created successfully",
		);
	}

	// --------------------------------------------------

	private async sendWelcomeEmail(
		user: User,
		temporaryPassword: string,
	): Promise<void> {
		if (!this.emailService) {
			return;
		}

		const displayName = user.userName || user.userId;

		try {
			await this.emailService.sendEmail({
				emailProperties: {
					to: user.userId,
					subject: "CMS account created",
					body: `Hi ${ displayName },\n\nYour CMS account is ready.\nUsername: ${ user.userId }\nTemporary Password: ${ temporaryPassword }\n\nPlease sign in and change your password immediately.`,
					htmlBody: `
						<p>Hi ${ displayName },</p>
						<p>Your CMS account has been created. Use the credentials below to sign in:</p>
						<ul>
							<li><strong>Username:</strong> ${ user.userId }</li>
							<li><strong>Temporary Password:</strong> ${ temporaryPassword }</li>
						</ul>
						<p>Please sign in and change your password immediately after logging in.</p>
					`,
				},
			});
		} catch (error) {
			this.logger.error(
				`Failed to send welcome email to ${ user.userId }`,
				error instanceof Error ? error.stack : JSON.stringify(error),
			);
		}
	}

	private async validateUserAttributeExists(
		request: AddUserUsecaseRequest,
	): Promise<void> {

		const userIdExists =
			await this.userRepository.findActiveUserID(request.userId);

		if (userIdExists) {
			throw new NotAcceptableException(
				`User ID ${ request.userId } already exists`,
			);
		}

		const employeeExists =
			await this.userRepository.findByEmployeeId(request.employeeId);

		if (employeeExists) {
			throw new NotAcceptableException(
				`Employee ID ${ request.employeeId } already exists`,
			);
		}
	}
	private generatePassword(): string {
		const length = 8;
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let password = "";

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * chars.length);
			password += chars[randomIndex];
		}

		return password;
	}
}
