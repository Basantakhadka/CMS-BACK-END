import {
	FilterConditionsDto,
	FiltersObjectsDto,
} from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { GetItemsForSelectMenuUsecaseRequest } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.request";
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
import { DenyChangeRequisitionRequestDto } from "../../shared/dtos/deny-change-requisition-request.dto";
import { ApproveUserChangeRequestDto } from "./dtos/approve-user-change-request.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { EditUserChangeRequestDto } from "./dtos/edit-user-change-request.dto";
import { GetOneUserChangeRequestDto } from "./dtos/get-one-user-change-request.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { AddUserUsecase } from "./usecases/add-user.usecase";
import { ChangeNewUserRequestUsecase } from "./usecases/change-new-user-change-request.usecase";
import { DeleteUserUsecase } from "./usecases/delete-user.usecase";
import { DenyUserChangeRequestUsecase } from "./usecases/deny-user-change-request.usecase";
import { GetBankBranchesForSelectMenuUsecase } from "./usecases/get-bank-branches-for-select-menu.usecase";
import { GetOneUserChangeRequestUsecase } from "./usecases/get-one-user-change-request.usercase";
import { GetOneUserUsecase } from "./usecases/get-one-user.usecase";
import { GetUserChangeRequestsListUsecase } from "./usecases/get-user-change-requests-list.usecase";
import { GetUsersAndUserChangeRequestsTotalCountUsecase } from "./usecases/get-users-and-user-change-requests-total-count.usecase";
import { GetUsersByRoleUsecase } from "./usecases/get-users-by-role.usecase";
import { GetUsersForSelectMenuUsecase } from "./usecases/get-users-for-select-menu.usecase";
import { GetUsersListUsecase } from "./usecases/get-users-list.usecase";
import { AddUserUsecaseRequest } from "./usecases/requests/add-user.usecase.request";
import { ChangeNewUserRequestUsecaseRequest } from "./usecases/requests/change-new-user-change-request.usecase.request";
import { DeleteUserUsecaseRequest } from "./usecases/requests/delete-user.usecase.request";
import { DenyUserChangeRequestUsecaseRequest } from "./usecases/requests/deny-user-change-request.usecase.request";
import { GetOneUserChangeRequestUsecaseRequest } from "./usecases/requests/get-one-user-change-request.usercase.request";
import { GetOneUserUsecaseRequest } from "./usecases/requests/get-one-user.usecase.request";
import { GetUsersAndUserChangeRequestsTotalCountUsecaseRequest } from "./usecases/requests/get-users-and-user-change-requests-total-count.usecase.request";
import { GetUsersByRoleUsecaseRequest } from "./usecases/requests/get-users-by-role.usecase.request";
import { GetUsersListUsecaseRequest } from "./usecases/requests/get-users-list.usecase.request";
import { ApproveNewUserChangeRequestUsecaseRequest } from "./usecases/requests/new-user-approve-change-request.usecase.request";
import { UpdateUserUsecaseRequest } from "./usecases/requests/update-user.usecase.request";
import { UpdateUserUsecase } from "./usecases/update-user.usecase";
import { ApproveNewUserChangeRequestUsecase } from "./usecases/user-approve-change-request.usecase";

import { PermissionInterceptor } from "CMS-BACK-END/src/core/interceptors/permission.interceptor";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { RevertChangeRequestDto } from "CMS-BACK-END/src/shared/dtos/change-request.dto";
import { AsyncLocalStorage } from "async_hooks";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ModifyUserChangeRequestUsecase } from "./usecases/modify-user-change-request.usecase";
import { ModifyUserChangeRequestUsecaseRequest } from "./usecases/requests/modify-user-change-request.usecase.request";
import { ResetUserPasswordUsecaseRequest } from "./usecases/requests/reset-user-password.request";
import { ResetUserPasswordUsecase } from "./usecases/reset-user-password.usecase";

@ApiTags('Identity Access | Users')
@Controller("identity-access")
@UseInterceptors(PermissionInterceptor)
export class UsersController {
	constructor(
		private readonly addUserUsecase: AddUserUsecase,
		private readonly getOneUserChangeRequestUsecase: GetOneUserChangeRequestUsecase,
		private readonly getUsersListUsecase: GetUsersListUsecase,
		private readonly denyUserChangeRequestUsecase: DenyUserChangeRequestUsecase,
		private readonly getUserChangeRequestsListUsecase: GetUserChangeRequestsListUsecase,
		private readonly getOneUserUsecase: GetOneUserUsecase,
		private readonly updateUserUsecase: UpdateUserUsecase,
		private readonly deleteUserUsecase: DeleteUserUsecase,
		private readonly getUsersForSelectMenuUsecase: GetUsersForSelectMenuUsecase,
		private readonly getBankBranchesForSelectMenuUsecase: GetBankBranchesForSelectMenuUsecase,
		private readonly getUsersByRoleUsecase: GetUsersByRoleUsecase,
		private readonly approveNewUserChangeRequestUsecase: ApproveNewUserChangeRequestUsecase,
		private readonly changeNewUserRequestUsecase: ChangeNewUserRequestUsecase,
		private readonly getUsersAndUsersChangeRequestTotalCountUsecase: GetUsersAndUserChangeRequestsTotalCountUsecase,
		private readonly modifyUserChangeRequestUsecase: ModifyUserChangeRequestUsecase,
		private readonly resetPasswordUsecase: ResetUserPasswordUsecase,
		private readonly als: AsyncLocalStorage<RequestContext>
	) {}

	@Post("users")
	async saveUser(@Body() body: CreateUserDto) {
		const createUser: CreateUserDto = body;
		const request = new AddUserUsecaseRequest(
			createUser.userName,
			createUser.userId.toLowerCase(),
			createUser.employeeId,
			createUser.branch,
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
			updateUser.branch,
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

	@Post("user-change-requests/list")
	async getUserChangeRequestsList(@Body() body: FilterConditionsDto) {
		const filterConditions: FilterConditionsDto = body;
		const request = new GetUsersListUsecaseRequest(filterConditions);
		return await this.getUserChangeRequestsListUsecase.execute(request);
	}

	@Post("user-change-requests/:id")
	async findOneUserChangeRequest(
		@Param("id") id: string,
		@Body() body: GetOneUserChangeRequestDto
	) {
		const userChangeRequest: GetOneUserChangeRequestDto = body;
		const request = new GetOneUserChangeRequestUsecaseRequest(
			id,
			userChangeRequest.refId
		);
		return await this.getOneUserChangeRequestUsecase.execute(request);
	}

	@Post("user-change-requests/:id/approve")
	async approveUserChangeRequests(
		@Param("id") id: string,
		@Body() body: ApproveUserChangeRequestDto
	) {
		const request = new ApproveNewUserChangeRequestUsecaseRequest(
			id,
			body.refId
		);
		return await this.approveNewUserChangeRequestUsecase.execute(
			request,
			this.als.getStore()
		);
	}

	@Post("user/entity-changes/:refId/:id/reject")
	async denyApproveUserChangeRequests(
		@Param("refId") refId: string,
		@Param("id") id: string,
		@Body() body: DenyChangeRequisitionRequestDto
	) {
		const denyUserChangeRequest: DenyChangeRequisitionRequestDto = body;
		const request = new DenyUserChangeRequestUsecaseRequest(
			id,
			refId,
			denyUserChangeRequest.denialReason
		);
		return await this.denyUserChangeRequestUsecase.execute(
			request,
			this.als.getStore()
		);
	}
	@Post("users-select-menu")
	async getUsersSelectMenu() {
		const request = new GetItemsForSelectMenuUsecaseRequest();
		return await this.getUsersForSelectMenuUsecase.execute(request);
	}
	@Post("branches-select-menu")
	async getBankBranchesSelectMenu() {
		const request = new GetItemsForSelectMenuUsecaseRequest();
		return await this.getBankBranchesForSelectMenuUsecase.execute(request);
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
	@Put("user/entity-changes/:refId/:id/approve")
	async approveNewUser(@Param("refId") refId: string, @Param("id") id: string) {
		try {
			const request = new ApproveNewUserChangeRequestUsecaseRequest(id, refId);
			return await this.approveNewUserChangeRequestUsecase.execute(
				request,
				this.als.getStore()
			);
		} catch (error) {
			throw error;
		}
	}
	@Put("user/entity-changes/:refId/:id/revert")
	async changeNewRoleRequest(
		@Param("refId") refId: string,
		@Param("id") id: string,
		@Body() body: RevertChangeRequestDto
	) {
		try {
			const changeReq: RevertChangeRequestDto = body;
			const request = new ChangeNewUserRequestUsecaseRequest(
				id,
				refId,
				changeReq.comments
			);
			return await this.changeNewUserRequestUsecase.execute(
				request,
				this.als.getStore()
			);
		} catch (error) {
			throw error;
		}
	}
	@Get("users/profile/details")
	async getProfileDetails() {
		const request = new GetOneUserUsecaseRequest(
			this.als.getStore()["currentUser"].loginId
		);
		return await this.getOneUserUsecase.execute(request);
	}
	@Put("user/entity-changes/:refId/:id/modify")
	async modifyChangeRequest(
		@Param("refId") refId: string,
		@Param("id") id: string,
		@Body() body: EditUserChangeRequestDto
	) {
		try {
			const changeReq: EditUserChangeRequestDto = body;
			const request = new ModifyUserChangeRequestUsecaseRequest(
				id,
				refId,
				changeReq.email,
				changeReq.userName,
				changeReq.employeeId,
				changeReq.branch,
				changeReq.roles,
				changeReq.active
			);
			return await this.modifyUserChangeRequestUsecase.execute(
				request,
				this.als.getStore()
			);
		} catch (error) {
			throw error;
		}
	}

	@Post("users-total-count")
	async getTotalCount(@Body() body: FiltersObjectsDto[]) {
		const filters: FiltersObjectsDto[] = body;
		const request = new GetUsersAndUserChangeRequestsTotalCountUsecaseRequest(
			filters
		);
		return await this.getUsersAndUsersChangeRequestTotalCountUsecase.execute(
			request, this.als.getStore()
		);
	}

	@Get("users/reset-pasword/:id")
	@ApiBearerAuth('X-Xsrf-Token')
	async resetPassword(@Param("id") id: string) {
		const request = new ResetUserPasswordUsecaseRequest(id);
		return await this.resetPasswordUsecase.execute(
			request,
			this.als.getStore()
		);
	}
}
