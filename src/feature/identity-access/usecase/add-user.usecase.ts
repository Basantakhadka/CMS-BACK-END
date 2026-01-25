import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";

import { ForbiddenException, Inject, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserRepository } from "../repositories/user.repository";
import { AddUserUsecaseRequest } from "./request/add-user.usecase.request";
import { AddUserUsecaseResponse } from "./response/add-user.usecase.response";
import { User } from "../entities/user.entity";

export class AddUserUsecase implements Usecase<AddUserUsecaseRequest, AddUserUsecaseResponse> {
	constructor (
		@Inject(UserDbRepository) private readonly userRepository?: UserRepository,
		@Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
	) { }
	async execute(request: AddUserUsecaseRequest, requestContext?: RequestContext): Promise<Result<AddUserUsecaseResponse>> {
		const loggedInUser = requestContext.getCurrentUser().loginId;
		const user = await this.userRepository.findById(loggedInUser);

		await this.validateUserAttributeExists(request);
		const addUserUsecase = new AddUserUsecase(this.userRepository);

		const response = new AddUserUsecaseResponse();
		return Result.createSuccessWithMessage(response, "User creation in progress");
	}

	protected async getUsersbyRole(role: string): Promise<UserByRole[]> {

		return await this.userRepository.findUsersByRoleId(role);
	}
	private async validateUserAttributeExists(request: AddUserUsecaseRequest): Promise<boolean> {
		let userIdExists: User, employeeIdExists: User;
		userIdExists = await this.userRepository.findActiveUserID(request.userId);
		if (userIdExists) {
			Result.createErrorWithMessage(new NotAcceptableException(`User ID: ${ request.userId } already exists`), "Duplicate User ID1");
		}
		employeeIdExists = await this.userRepository.findByEmployeeId(request.employeeId);
		if (employeeIdExists) {
			Result.createErrorWithMessage(new NotAcceptableException(`Employee ID: ${ request.employeeId } already exists`), "Duplicate Employee ID");
		}
		return false;
	}
}