import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import {
	Inject,
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

export class AddUserUsecase
	implements Usecase<AddUserUsecaseRequest, AddUserUsecaseResponse> {

	constructor (
		@Inject(UserDbRepository)
		private readonly userRepository: UserRepository,

		@Inject(UserCredentialDbRepository)
		private readonly userCredentialRepository: UserCredentialRepository,

		@Inject(RolesDbRepository)
		private readonly rolesRepository: RolesRepository,
	) { }

	async execute(
		request: AddUserUsecaseRequest,
		requestContext?: RequestContext,
	): Promise<Result<AddUserUsecaseResponse>> {

		const loggedInUser = requestContext.getCurrentUser().loginId;
		const user = await this.userRepository.findById(loggedInUser);

		// 1️⃣ Validate duplicates
		await this.validateUserAttributeExists(request);

		// 2️⃣ Create User
		const userId = IdGenerator.generateId("v4");

		const users = new User();
		user.id = userId;
		user.userId = request.userId;
		user.userName = request.userName;
		user.employeeId = request.employeeId;
		user.roles = request.roles;
		user.active = true;
		user.deleted = false;
		user.createdBy = { label: "SYSTEM", value: loggedInUser };
		user.createdOn = new Date();

		await this.userRepository.insert(user);
		const randomPassword: string = "Test@123";

		// 3️⃣ Create User Credential
		const credential = new UserCredential();
		credential.id = userId; // 🔑 SAME ID (important)
		credential.password = await hashPassword(randomPassword, user.id, user.userId);
		version: IdGenerator.generateId("4"),
			credential.enforcePasswordChange = true;
		credential.unsuccessfulLoginAttempts = 0;
		credential.loginAttemptsTimer = null,
			credential.unsuccessfulLoginAttempts = null,
			credential.blocked = false;
		credential.passwordHistory = [];
		credential.expiryTime = null;


		await this.userCredentialRepository.insert(credential);

		// 4️⃣ Assign roles
		user.roles.forEach(async (role) => {
			const userByRole = new UserByRole();
			userByRole.roleId = role.value;
			userByRole.userId = user.id;
			await this.userRepository.insertUserByRole(userByRole);
		});

		// 5️⃣ Response
		return Result.createSuccessWithMessage(
			new AddUserUsecaseResponse(),
			"User created successfully",
		);
	}

	// --------------------------------------------------

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
