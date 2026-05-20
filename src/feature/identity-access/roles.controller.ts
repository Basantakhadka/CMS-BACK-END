import { RequestContextProvider } from "@app/core/middleware/RequestContextProvider";
import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";
import { AddRoleUsecase } from "./usecase/add-role.usecase";
import { DeleteRoleUsecase } from "./usecase/delete-role.usecase";
import { GetAllRoleUsecase } from "./usecase/get-all-role.usecase";
import { GetPermissonUsecase } from "./usecase/get-permission.usecase";
import { AddRoleUsecaseRequest } from "./usecase/request/add-role.usecase.request";
import { DeleteRoleUsecaseRequest } from "./usecase/request/delete-role.usecase.request";
import { UpdateRoleUsecaseRequest } from "./usecase/request/update-role.usecase.request";
import { ViewRoleUsecaseRequest } from "./usecase/request/view-role.usecase.request";
import { UpdateRoleUsecase } from "./usecase/update-role.usecase";
import { ViewRoleUsecase } from "./usecase/view-role.usecase";
import { GetRolesForSelectMenuUsecase } from "./usecase/get-roles-for-select-menu.usecase";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { GetRoleUsecaseRequest } from "./usecase/request/get-role.usecase.request";
import { RolesTotalCountUsecase } from "./usecase/roles-total-count.usecase";
import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Identity Access | Roles')
@Controller("identity-access")
@UseInterceptors(PermissionInterceptor)
export class RolesController {
	constructor (
		private readonly addRoleUsecase: AddRoleUsecase,
		private readonly getRoleUsecase: GetAllRoleUsecase,
		private readonly deleteRoleUsecase: DeleteRoleUsecase,
		private readonly updateRoleUsecase: UpdateRoleUsecase,
		private readonly viewRoleUsecase: ViewRoleUsecase,
		private readonly getPermissionUsecase: GetPermissonUsecase,
		private readonly getRolesForSelectMenuUsecase: GetRolesForSelectMenuUsecase,
		private readonly rolesTotalCountUsecase: RolesTotalCountUsecase,
		private readonly als: AsyncLocalStorage<RequestContext>
	) { }
	   @Post("roles")
	   async addRoles(@Body() body: CreateRoleDto) {
		   try {
			   const role: CreateRoleDto = body;
			   const request = new AddRoleUsecaseRequest(
				   role.title,
				   role.active,
				   role.permissions,
				   role.contractIds
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
				   role.permissions,
				   role.contractIds
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
			return await this.getPermissionUsecase.execute('',this.als.getStore());
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

}
