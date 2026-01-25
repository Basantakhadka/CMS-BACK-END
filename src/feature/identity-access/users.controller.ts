import {
	FilterConditionsDto,
	FiltersObjectsDto,
} from "@app/shared/dtos/filter-conditions.dto";
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseInterceptors,
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { AddUserUsecase } from "./usecase/add-user.usecase";
import { DeleteUserUsecase } from "./usecase/delete-user.usecase";
import { GetOneUserUsecase } from "./usecase/get-one-user.usecase";
import { GetUsersListUsecase } from "./usecase/get-users-list.usecase";
import { AddUserUsecaseRequest } from "./usecase/request/add-user.usecase.request";
import { DeleteUserUsecaseRequest } from "./usecase/request/delete-user.usecase.request";
import { GetOneUserUsecaseRequest } from "./usecase/request/get-one-user.usecase.request";
import { GetUsersListUsecaseRequest } from "./usecase/request/get-users-list.usecase.request";
import { UpdateUserUsecaseRequest } from "./usecase/request/update-user.usecase.request";
import { UpdateUserUsecase } from "./usecase/update-user.usecase";

import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { RequestContext } from "@app/core/middleware/request_context";
import { AsyncLocalStorage } from "async_hooks";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetUsersByRoleUsecaseRequest } from "./usecase/request/get-users-by-role.usecase.request";
import { GetUsersByRoleUsecase } from "./usecase/get-users-by-role.usecase";


@ApiTags('Identity Access | Users')
@Controller("identity-access")
@UseInterceptors(PermissionInterceptor)
export class UsersController {
	constructor (
		private readonly addUserUsecase: AddUserUsecase,
		private readonly getUsersListUsecase: GetUsersListUsecase,
		private readonly getOneUserUsecase: GetOneUserUsecase,
		private readonly updateUserUsecase: UpdateUserUsecase,
		private readonly deleteUserUsecase: DeleteUserUsecase,
		private readonly getUsersByRoleUsecase: GetUsersByRoleUsecase,
		private readonly als: AsyncLocalStorage<RequestContext>
	) { }

	@Post("users")
	async saveUser(@Body() body: CreateUserDto) {
		const createUser: CreateUserDto = body;
		const request = new AddUserUsecaseRequest(
			createUser.userName,
			createUser.userId.toLowerCase(),
			createUser.employeeId,
			createUser.roles,
			createUser.active
		);
		return await this.addUserUsecase.execute(request, this.als.getStore());
	}

	@Post("users/list")
	async getUsers(@Body() body: FilterConditionsDto) {
		const filterConditions: FilterConditionsDto = body;
		const request = new GetUsersListUsecaseRequest(filterConditions);
		return await this.getUsersListUsecase.execute(request);
	}

	@Get("users/:id")
	async getOneUser(@Param("id") id: string) {
		const request = new GetOneUserUsecaseRequest(id);
		return await this.getOneUserUsecase.execute(request);
	}

	@Put("users/:id")
	async updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
		const updateUser: UpdateUserDto = body;
		const request = new UpdateUserUsecaseRequest(
			id,
			updateUser.userName,
			updateUser.userId.toLowerCase(),
			updateUser.employeeId,
			updateUser.roles,
			updateUser.active
		);
		return await this.updateUserUsecase.execute(request, this.als.getStore());
	}

	@Delete("users/:id")
	async deleteUser(@Param("id") id: string) {
		const request = new DeleteUserUsecaseRequest(id);
		return await this.deleteUserUsecase.execute(request, this.als.getStore());
	}

	@Post("role-users-select-menu/:id")
	async getUsersByRoleForSelectMenu(@Param("id") id: string) {
		try {
			const request = new GetUsersByRoleUsecaseRequest(id);
			return await this.getUsersByRoleUsecase.execute(request);
		} catch (error) {
			throw error;
		}
	}


}
