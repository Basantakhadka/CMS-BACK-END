import { BaseRepository } from "CMS-BACK-END/src/core/repository/base.repository";
import { Filter } from "CMS-BACK-END/src/core/repository/search/filter";
import { Page } from "CMS-BACK-END/src/core/repository/search/page";
import { PageInfo } from "CMS-BACK-END/src/core/repository/search/page.info";
import { FilterConditionsDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";
import { PermissionsByRolesView } from "../entities/permission.view";
import { Role, RoleChangeRequest } from "../entities/roles.entity";
import {MerchantUserRolesEntity} from "CMS-BACK-END/src/feature/identity-access/entities/merchant-user-roles.entity";

export interface RolesRepository extends BaseRepository<Role, string> {
	save(entity: Role):Promise<Role>;
	insertChangeRequest(entity: RoleChangeRequest): Promise<RoleChangeRequest>;
	updateChangeRequest(entity: RoleChangeRequest): Promise<RoleChangeRequest>;
	findChangeRequestById(
		entity: RoleChangeRequest
	): Promise<RoleChangeRequest[]>;
	findChangeRequestByRefIdAndStatus(
		refId: string,
		status?: string
	): Promise<RoleChangeRequest[]>;
	findChangeRequestByRefIdAndRequestId(
		refId: string,
		changeRequestId: string
	): Promise<RoleChangeRequest>;
	findRolesInIdList(idList: string[]): Promise<SelectMenu[]>;
	findAllRolesWithPagination(
		filters: FilterConditionsDto,
		pageInfo: PageInfo
	): Promise<Page<Role>>;
	findAllChangeRequestWithPagination(
		filters: FilterConditionsDto,
		pageInfo: PageInfo
	): Promise<Page<RoleChangeRequest>>;
	findTotalChangeRequestCount(): Promise<number>;
	findPermissionsByRoles(filters: Filter[]): Promise<PermissionsByRolesView[]>;
	findSharedMerchantUserRolesByTitle(title:string): Promise<MerchantUserRolesEntity[]>
}