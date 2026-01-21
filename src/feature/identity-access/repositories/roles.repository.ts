import { BaseRepository } from "@app/core/repository/base.repository";
import { Filter } from "@app/core/repository/search/filter";
import { Page } from "@app/core/repository/search/page";
import { PageInfo } from "@app/core/repository/search/page.info";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { SelectMenu } from "@app/shared/utils/get-items-for-select-menu.usecase.response";
import { PermissionsByRolesView } from "../entities/permission.view";
import { Role } from "../entities/roles.entity";


export interface RolesRepository extends BaseRepository<Role, string> {
	save(entity: Role): Promise<Role>;
	findRolesInIdList(idList: string[]): Promise<SelectMenu[]>;
	findAllRolesWithPagination(
		filters: FilterConditionsDto,
		pageInfo: PageInfo
	): Promise<Page<Role>>;
	findPermissionsByRoles(filters: Filter[]): Promise<PermissionsByRolesView[]>;
}