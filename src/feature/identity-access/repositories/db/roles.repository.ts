import {
	CustomRepository,
	DatasourceService,
} from "@app/core/db/datasource.service";
import { Filter } from "@app/core/repository/search/filter";
import { Page } from "@app/core/repository/search/page";
import { PageInfo } from "@app/core/repository/search/page.info";
import { PageableInfo } from "@app/core/repository/search/pageable.info";
import {
	Pagination,
	PaginationOptions,
} from "@app/core/repository/search/pagination";
import { SearchMeta } from "@app/core/repository/search/search.meta";
import { SortMeta, SortOrder } from "@app/core/repository/search/sort.meta";
import { MapSnakeCaseToCamelCase } from "@app/feature/common/mapper";
import { FilterCondition } from "@app/shared/constants/filter-condition.constant";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { SelectMenu } from "@app/shared/utils/get-items-for-select-menu.usecase.response";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PermissionsByRolesView } from "../../entities/permission.view";
import { Role } from "../../entities/roles.entity";
import { RolesRepository } from "../roles.repository";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";


@Injectable()
export class RolesDbRepository implements RolesRepository {
	private rolesTable = "cms_identity_access_roles";
    constructor (
        private dataSourceService: DatasourceService,
        private readonly als: AsyncLocalStorage<RequestContext>,
    ) { }

	private getClientCode(strict = true) {
		const clientCode = this.als.getStore()?.getCurrentUser()?.clientCode;
		if (!clientCode && strict) {
			throw new UnauthorizedException("Missing client context");
		}
		return clientCode;
	}
	async save(entity: Role): Promise<Role> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		entity.clientCode = clientCode;
		const savedRole = await this.rolesRepository.findOneBy({ id: entity.id, clientCode });
		if (savedRole) {
			await this.rolesRepository.update(
				{ id: entity.id, clientCode },
				entity
			);
			return entity;
		}

		await this.rolesRepository.insert(entity);
		return entity;
	}

	rolesRepository: CustomRepository<Role>;

	private async setRepository() {
		this.rolesRepository = await this.dataSourceService.getRepository(Role);

	}

	async insert(entity: Role): Promise<Role> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		entity.clientCode = clientCode;
		await this.rolesRepository.insert(entity);
		return entity;
	}
	async update(entity: Partial<Role>): Promise<Role> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		const response = await this.rolesRepository.update(
			{ id: entity.id, clientCode },
			entity
		);
		return response.raw[0];
	}
	async delete(entity: Role): Promise<void> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		await this.rolesRepository.update({ id: entity.id, clientCode }, entity);
	}
	async findById(id: string): Promise<Role> {
		await this.setRepository();
		const clientCode = this.getClientCode(false);
		const criteria: any = { id };
		if (clientCode) {
			criteria.clientCode = clientCode;
		}
		return await this.rolesRepository.findOneBy(criteria);
	}
	async findAll(): Promise<Role[]> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		return await this.rolesRepository.findBy({ deleted: false, clientCode });
	}

	findAllWithFilters(filters: SearchMeta): Promise<Role[]> {
		throw new Error("Method not implemented.");
	}
	findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
		throw new Error("Method not implemented.");
	}
	findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo
	): Promise<Page<Role>> {
		throw new Error("Method not implemented.");
	}
	async findTotalCount(): Promise<number> {
		await this.setRepository();
		let totalCount: number;
		const clientCode = this.getClientCode();
		const result = await this.rolesRepository.query(
			`SELECT count(*) AS "totalCount" FROM ${ this.rolesRepository.schema }.${ this.rolesTable } WHERE deleted=false AND client_code = $1`,
			[clientCode]
		);
		totalCount = parseInt(result[0]?.totalCount || 0);
		return totalCount;
	}

	async findRolesInIdList(idList: string[]): Promise<SelectMenu[]> {
		await this.setRepository();
		if (!idList?.length) {
			return [];
		}
		const clientCode = this.getClientCode();
		const placeholders = idList.map((_, index) => `$${ index + 2 }`).join(",");
		const query =
			`SELECT title, id from ${ this.rolesRepository.schema }.${ this.rolesTable } where client_code = $1 and id IN (${ placeholders })`;
		const roles = await this.rolesRepository.query(query, [clientCode, ...idList]);
		return roles?.map((item) => new SelectMenu(item.title, item.id));
	}
	async findAllRolesWithPagination(
		filters: FilterConditionsDto,
		pageInfo: PageInfo
	): Promise<Page<Role>> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const queryBuilder = this.rolesRepository
			.createQueryBuilder()
			.where("deleted = false")
			.andWhere("client_code = :clientCode", { clientCode });
		const options: PaginationOptions = {
			defaultSortMeta: new SortMeta("createdOn,id", SortOrder.DESC),
			columnsMap: null,
			filters: filters.filters,
		};
		const pagination = new Pagination<Role>(this.rolesRepository, pageInfo);
		const page = pagination.paginate(queryBuilder, options);
		return page;
	}

	async findPermissionsByRoles(
		filters: Filter[]
	): Promise<PermissionsByRolesView[]> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		let query = `SELECT ${ Role.getColumnName(
			"permissions"
		) }, ${ Role.getColumnName("deleted") }, ${ Role.getColumnName(
			"active"
		) } FROM ${ this.rolesRepository.schema }.${ Role.getTableName() }`;
		let filterExpression = FilterCondition.buildFilterExpression(filters);
		if (filterExpression?.length) {
			query += ` WHERE ${ filterExpression } AND client_code = '${ clientCode }'`;
		} else {
			query += ` WHERE client_code = '${ clientCode }'`;
		}

		const result = await this.rolesRepository.query(query);
		return MapSnakeCaseToCamelCase(result);
	}


}
