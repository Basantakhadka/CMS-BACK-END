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
import { Injectable } from "@nestjs/common";
import { PermissionsByRolesView } from "../../entities/permission.view";
import { Role } from "../../entities/roles.entity";
import { RolesRepository } from "../roles.repository";


@Injectable()
export class RolesDbRepository implements RolesRepository {
	private rolesTable = "cms_identity_access_roles";
	constructor (private dataSourceService: DatasourceService) { }
	async save(entity: Role): Promise<Role> {
		await this.setRepository();
		const savedRole = await this.rolesRepository.findOneBy({ id: entity.id });
		if (savedRole) {
			await this.rolesRepository.update(
				{ id: entity.id },
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
		await this.rolesRepository.insert(entity);
		return entity;
	}
	async update(entity: Partial<Role>): Promise<Role> {
		await this.setRepository();
		const response = await this.rolesRepository.update(
			{ id: entity.id },
			entity
		);
		return response.raw[0];
	}
	async delete(entity: Role): Promise<void> {
		await this.setRepository();
		await this.rolesRepository.update({ id: entity.id }, entity);
	}
	async findById(id: string): Promise<Role> {
		await this.setRepository();
		return await this.rolesRepository.findOneBy({ id });
	}
	async findAll(): Promise<Role[]> {
		await this.setRepository();
		return await this.rolesRepository.findBy({ deleted: false });
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
		const result = await this.rolesRepository.query(
			`SELECT count(*) AS "totalCount" FROM ${ this.rolesRepository.schema }.${ this.rolesTable } WHERE deleted=false`
		);
		totalCount = parseInt(result[0]?.totalCount || 0);
		return totalCount;
	}

	async findRolesInIdList(idList: string[]): Promise<SelectMenu[]> {
		await this.setRepository();
		const query =
			`SELECT title, id from ${ this.rolesRepository.schema }.${ this.rolesTable } where id IN (` +
			idList.map((id) => `'${ id }'`) +
			");";
		const roles = await this.rolesRepository.query(query);
		return roles?.map((item) => new SelectMenu(item.title, item.id));
	}
	async findAllRolesWithPagination(
		filters: FilterConditionsDto,
		pageInfo: PageInfo
	): Promise<Page<Role>> {
		await this.setRepository();
		const queryBuilder = this.rolesRepository
			.createQueryBuilder()
			.where("deleted = false");
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
		let query = `SELECT ${ Role.getColumnName(
			"permissions"
		) }, ${ Role.getColumnName("deleted") }, ${ Role.getColumnName(
			"active"
		) } FROM ${ this.rolesRepository.schema }.${ Role.getTableName() }`;
		let filterExpression = FilterCondition.buildFilterExpression(filters);
		query += ` WHERE ${ filterExpression }`;

		const result = await this.rolesRepository.query(query);
		return MapSnakeCaseToCamelCase(result);
	}


}
