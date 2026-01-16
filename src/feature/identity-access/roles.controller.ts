import { RequestContextProvider } from "CMS-BACK-END/src/core/middleware/RequestContextProvider";
import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { ApproveChangeRequestDto, ViewChangeRequestDto } from "./dtos/change-requests.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";
import { AddRoleUsecase } from "./usecases/add-role.usecase";
import { DeleteRoleUsecase } from "./usecases/delete-role.usecase";
import { GetAllRoleUsecase } from "./usecases/get-all-role.usecase";
import { GetPermissonUsecase } from "./usecases/get-permission.usecase";
import { AddRoleUsecaseRequest } from "./usecases/requests/add-role.usecase.request";
import { DeleteRoleUsecaseRequest } from "./usecases/requests/delete-role.usecase.request";
import { UpdateRoleUsecaseRequest } from "./usecases/requests/update-role.usecase.request";
import { ViewRoleUsecaseRequest } from "./usecases/requests/view-role.usecase.request";
import { GetRolesChangeRequestUsecase } from "./usecases/roles-get-change-request.usecase";
import { UpdateRoleUsecase } from "./usecases/update-role.usecase";
import { ViewRoleUsecase } from "./usecases/view-role.usecase";
import { RolesViewChangeRequestUsecase } from "./usecases/roles-view-change-request.usecase";
import { RolesViewChangeRequestUsecaseRequest } from "./usecases/requests/roles-view-change-request.usecase.request";
import { DenyChangeRequisitionRequestDto } from "CMS-BACK-END/src/shared/dtos/deny-change-requisition-request.dto";
import { RolesDenyChangeRequestUsecaseRequest } from "./usecases/requests/roles-deny-change-request.usecase.request";
import { RolesDenyChangeRequestUsecase } from "./usecases/roles-deny-change-request.usecase";
import { GetRolesForSelectMenuUsecase } from "./usecases/get-roles-for-select-menu.usecase";
import { ApproveNewRoleChangeRequestUsecase } from "./usecases/role-approve-change-request.usecase";
import { ApproveNewRoleChangeRequestUsecaseRequest } from "./usecases/requests/new-role-approve-change-request.usecase.request";
import { ChangeNewRoleRequestUsecaseRequest } from "./usecases/requests/change-new-role-change-request.usecase.request";
import { ChangeNewRoleRequestUsecase } from "./usecases/change-new-role-change-request.usecase";
import { EditRoleChangeRequestDto } from "./dtos/edit-role-change-request.dto";
import { RevertChangeRequestDto } from "CMS-BACK-END/src/shared/dtos/change-request.dto";
import { ModifyRoleChangeRequestUsecase } from "./usecases/modify-role-change-request.usecase";
import { ModifyRoleChangeRequestUsecaseRequest } from "./usecases/requests/modify-role-change-request.usecase.request";
import { FilterConditionsDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { RolesGetChangeRequestUsecaseRequest } from "./usecases/requests/roles-get-change-request.usecase.request";
import { GetRoleUsecaseRequest } from "./usecases/requests/get-role.usecase.request";
import { RolesChangeRequestTotalCountUsecase } from "./usecases/roles-change-request-total-count.usecase";
import { RolesTotalCountUsecase } from "./usecases/roles-total-count.usecase";
import { PermissionInterceptor } from "CMS-BACK-END/src/core/interceptors/permission.interceptor";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Identity Access | Roles')
@Controller("identity-access")
@UseInterceptors(PermissionInterceptor)
export class RolesController {
	constructor(
		private readonly addRoleUsecase: AddRoleUsecase,
		private readonly getRoleUsecase: GetAllRoleUsecase,
		private readonly deleteRoleUsecase: DeleteRoleUsecase,
		private readonly updateRoleUsecase: UpdateRoleUsecase,
		private readonly viewRoleUsecase: ViewRoleUsecase,
		private readonly getPermissionUsecase: GetPermissonUsecase,
		private readonly getChangeRequestsUsecase: GetRolesChangeRequestUsecase,
		private readonly viewChangeRequestUsecase: RolesViewChangeRequestUsecase,
		private readonly denyChangeRequestUsecase: RolesDenyChangeRequestUsecase,
		private readonly getRolesForSelectMenuUsecase: GetRolesForSelectMenuUsecase,
		private readonly approveNewRoleChangeRequestUsecase: ApproveNewRoleChangeRequestUsecase,
		private readonly changeNewRoleRequestUsecase: ChangeNewRoleRequestUsecase,
		private readonly modifyRoleChangeRequestUsecase: ModifyRoleChangeRequestUsecase,
		private readonly rolesTotalCountUsecase: RolesTotalCountUsecase,
		private readonly rolesChangeRequestTotalCountUsecase: RolesChangeRequestTotalCountUsecase,
		private readonly als: AsyncLocalStorage<RequestContext>
	) {}
	@Post("roles")
	async addRoles(@Body() body: CreateRoleDto) {
		try {
			const role: CreateRoleDto = body;
			const request = new AddRoleUsecaseRequest(
				role.title,
				role.active,
				role.permissions
			);
			return await this.addRoleUsecase.execute(request, this.als.getStore());
		} catch (error) {
			throw error;
		}
	}
	@Post("roles/list")
	async getRolesList(@Body() body: FilterConditionsDto) {
		try {
			const filterConditions: FilterConditionsDto = body;
			const request = new GetRoleUsecaseRequest(filterConditions);
			return await this.getRoleUsecase.execute(request);
		} catch (error) {
			throw error;
		}
	}
	@Delete("roles/:id")
	async deleteRole(@Param("id") id: string) {
		try {
			const request = new DeleteRoleUsecaseRequest(id);
			return await this.deleteRoleUsecase.execute(request, this.als.getStore());
		} catch (error) {
			throw error;
		}
	}
	@Put("roles/:id")
	async updateRole(@Param("id") id: string, @Body() body: UpdateRoleDto) {
		try {
			const role: UpdateRoleDto = body;
			const request = new UpdateRoleUsecaseRequest(
				id,
				role.title,
				role.active,
				role.permissions
			);
			return await this.updateRoleUsecase.execute(request, this.als.getStore());
		} catch (error) {
			throw error;
		}
	}
	@Get("roles/:id")
	async viewRole(@Param("id") id: string) {
		try {
			const request = new ViewRoleUsecaseRequest(id);
			return await this.viewRoleUsecase.execute(request);
		} catch (error) {
			throw error;
		}
	}
	@Get("roles-permissionsui")
	async getPermissions() {
		try {
			return await this.getPermissionUsecase.execute();
		} catch (error) {
			throw error;
		}
	}
	@Post("roles-change-requests")
	async getChangeRequest(@Body() body: FilterConditionsDto) {
		try {
			const filterConditions: FilterConditionsDto = body;
			const request = new RolesGetChangeRequestUsecaseRequest(filterConditions);
			return await this.getChangeRequestsUsecase.execute(request);
		} catch (error) {
			throw error;
		}
	}
	@Post("roles-change-requests/:id/approve")
	async approveChangeRequest(
		@Param("id") id: string,
		@Body() body: ApproveChangeRequestDto
	) {
		try {
			const request = new ApproveNewRoleChangeRequestUsecaseRequest(
				id,
				body.roleId
			);
			return await this.approveNewRoleChangeRequestUsecase.execute(
				request,
				this.als.getStore()
			);
		} catch (error) {
			throw error;
		}
	}
	@Put("role/roles-changes/:refId/:id/approve")
	async approveNewrole(@Param("refId") refId: string, @Param("id") id: string) {
		try {
			const request = new ApproveNewRoleChangeRequestUsecaseRequest(id, refId);
			return await this.approveNewRoleChangeRequestUsecase.execute(
				request,
				this.als.getStore()
			);
		} catch (error) {
			throw error;
		}
	}
	@Put("role/roles-changes/:refId/:id/revert")
	async changeNewRoleRequest(
		@Param("refId") refId: string,
		@Param("id") id: string,
		@Body() body: RevertChangeRequestDto
	) {
		try {
			const changeReq: RevertChangeRequestDto = body;
			const request = new ChangeNewRoleRequestUsecaseRequest(
				id,
				refId,
				changeReq.comments
			);
			return await this.changeNewRoleRequestUsecase.execute(
				request,
				this.als.getStore()
			);
		} catch (error) {
			throw error;
		}
	}
	@Put("role/roles-changes/:refId/:id/modify")
	async modifyChangeRequest(
		@Param("refId") refId: string,
		@Param("id") id: string,
		@Body() body: EditRoleChangeRequestDto
	) {
		try {
			const changeReq: EditRoleChangeRequestDto = body;
			const request = new ModifyRoleChangeRequestUsecaseRequest(
				id,
				refId,
				changeReq.title,
				changeReq.active,
				changeReq.permissions
			);
			return await this.modifyRoleChangeRequestUsecase.execute(
				request,
				this.als.getStore()
			);
		} catch (error) {
			throw error;
		}
	}

	@Post("roles-change-requests/:id")
	async getSingleChangeRequest(
		@Param("id") id: string,
		@Body() body: ViewChangeRequestDto
	) {
		try {
			const request = new RolesViewChangeRequestUsecaseRequest(body.roleId, id);
			return await this.viewChangeRequestUsecase.execute(request);
		} catch (error) {
			throw error;
		}
	}
	@Post("role/roles-changes/:refId/:id/reject")
	async denyChangeRequest(
		@Param("refId") refId: string,
		@Param("id") id: string,
		@Body() body: DenyChangeRequisitionRequestDto
	) {
		try {
			const changeRequest: DenyChangeRequisitionRequestDto = body;
			const request = new RolesDenyChangeRequestUsecaseRequest(
				id,
				refId,
				changeRequest.denialReason
			);
			return await this.denyChangeRequestUsecase.execute(
				request,
				this.als.getStore()
			);
		} catch (error) {
			throw error;
		}
	}
	@Post("roles-select-menu")
	async getRolesListForSelectMenu() {
		try {
			return await this.getRolesForSelectMenuUsecase.execute();
		} catch (error) {
			throw error;
		}
	}
	@Get("roles-total-count")
	async getRolesTotalCount() {
		try {
			return await this.rolesTotalCountUsecase.execute();
		} catch (error) {
			throw error;
		}
	}
	@Get("roles-change-request/total-count")
	async getRolesChangeRequestTotalCount() {
		try {
			return await this.rolesChangeRequestTotalCountUsecase.execute();
		} catch (error) {
			throw error;
		}
	}
}
