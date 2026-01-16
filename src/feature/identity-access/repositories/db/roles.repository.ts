import {
	CustomRepository,
	DatasourceService,
} from "CMS-BACK-END/src/core/db/datasource.service";
import { Filter } from "CMS-BACK-END/src/core/repository/search/filter";
import { Page } from "CMS-BACK-END/src/core/repository/search/page";
import { PageInfo } from "CMS-BACK-END/src/core/repository/search/page.info";
import { PageableInfo } from "CMS-BACK-END/src/core/repository/search/pageable.info";
import {
	Pagination,
	PaginationOptions,
} from "CMS-BACK-END/src/core/repository/search/pagination";
import { SearchMeta } from "CMS-BACK-END/src/core/repository/search/search.meta";
import { SortMeta, SortOrder } from "CMS-BACK-END/src/core/repository/search/sort.meta";
import { MapSnakeCaseToCamelCase } from "@app/feature/common/mapper";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { FilterCondition } from "CMS-BACK-END/src/shared/constants/filter-condition.constant";
import { FilterConditionsDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";
import { Injectable } from "@nestjs/common";
import { PermissionsByRolesView } from "../../entities/permission.view";
import { Role, RoleChangeRequest } from "../../entities/roles.entity";
import { RolesRepository } from "../roles.repository";
import {MerchantUserRolesEntity} from "CMS-BACK-END/src/feature/identity-access/entities/merchant-user-roles.entity";

@Injectable()
export class RolesDbRepository implements RolesRepository {
	private rolesTable = "bankportal_identity_access_roles";
	constructor(private dataSourceService: DatasourceService) {}
	async save(entity: Role): Promise<Role> {
		await this.setRepository();
		const savedRole = await this.rolesRepository.findOneBy({ id : entity.id });
		if(savedRole){
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
	rolesChangeRequestRepository: CustomRepository<RoleChangeRequest>;
	merchantUserRolesRepository: CustomRepository<MerchantUserRolesEntity>;

	private async setRepository() {
		this.rolesRepository = await this.dataSourceService.getRepository(Role);
		this.rolesChangeRequestRepository =
			await this.dataSourceService.getRepository(RoleChangeRequest);
		this.merchantUserRolesRepository = await this.dataSourceService.getRepository(MerchantUserRolesEntity);

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
	async insertChangeRequest(
		entity: RoleChangeRequest
	): Promise<RoleChangeRequest> {
		await this.setRepository();
		await this.rolesChangeRequestRepository.insert(entity);
		return entity;
	}
	async updateChangeRequest(
		entity: RoleChangeRequest
	): Promise<RoleChangeRequest> {
		await this.setRepository();
		await this.rolesChangeRequestRepository.update({refId:entity.refId, id:entity.id},entity);
		return entity;
	}
	async findChangeRequestById(
		entity: RoleChangeRequest
	): Promise<RoleChangeRequest[]> {
		await this.setRepository();
		const data = await this.rolesChangeRequestRepository.findBy({
			refId: entity.refId,
			id: entity.id,
		});
		return data;
	}
	async findChangeRequestByRefIdAndStatus(
		refId: string,
		status?: string
	): Promise<RoleChangeRequest[]> {
		await this.setRepository();
		const result = await this.rolesChangeRequestRepository.findBy({
			refId,
			changeRequestStatus: status,
		});
		return result;
	}
	async findChangeRequestByRefIdAndRequestId(
		refId: string,
		changeRequestId: string
	): Promise<RoleChangeRequest> {
		await this.setRepository();
		return await this.rolesChangeRequestRepository.findOneBy({
			refId: refId,
			id: changeRequestId,
		});
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
			`SELECT count(*) AS "totalCount" FROM ${this.rolesRepository.schema}.${this.rolesTable} WHERE deleted=false`
		);
		totalCount = parseInt(result[0]?.totalCount || 0);
		return totalCount;
	}
	async findTotalChangeRequestCount(): Promise<number> {
		await this.setRepository();
		const result = await this.rolesChangeRequestRepository.query(
			`SELECT count(*) AS "totalCount" FROM ${
				this.rolesChangeRequestRepository.schema
			}.${RoleChangeRequest.getTableName()} WHERE change_request_status = '${
				ChangeRequestOutcomeStatus.IN_PROGRESS.name
			}'`
		);
		return parseInt(result[0]?.totalCount || 0);
	}
	async findRolesInIdList(idList: string[]): Promise<SelectMenu[]> {
		await this.setRepository();
		const query =
			`SELECT title, id from ${this.rolesRepository.schema}.${this.rolesTable} where id IN (` +
			idList.map((id) => `'${id}'`) +
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
	async findAllChangeRequestWithPagination(
		filters: FilterConditionsDto,
		pageInfo: PageInfo
	): Promise<Page<RoleChangeRequest>> {
		await this.setRepository();
		const queryBuilder = this.rolesChangeRequestRepository.createQueryBuilder()
								.where(`change_request_status = '${ChangeRequestOutcomeStatus.IN_PROGRESS.name}'`);
		const options: PaginationOptions = {
			defaultSortMeta: new SortMeta("requestedOn,id", SortOrder.DESC),
			columnsMap: null,
			filters: filters.filters,
		};
		const pagination = new Pagination<RoleChangeRequest>(
			this.rolesChangeRequestRepository,
			pageInfo
		);
		const page = pagination.paginate(queryBuilder, options);
		return page;
	}

	async findPermissionsByRoles(
		filters: Filter[]
	): Promise<PermissionsByRolesView[]> {
		await this.setRepository();
		let query = `SELECT ${Role.getColumnName(
			"permissions"
		)}, ${Role.getColumnName("deleted")}, ${Role.getColumnName(
			"active"
		)} FROM ${this.rolesRepository.schema}.${Role.getTableName()}`;
		let filterExpression = FilterCondition.buildFilterExpression(filters);
		query += ` WHERE ${filterExpression}`;

		const result = await this.rolesRepository.query(query);
		return MapSnakeCaseToCamelCase(result);
	}

	/**
	 * Finds shared merchant user roles by their title.
	 * @async
	 * @function
	 * @name findSharedMerchantUserRolesByTitle
	 * @param {string} title - The title of the merchant user roles to search for.
	 * @returns {Promise<MerchantUserRolesEntity[]>} A promise that resolves to an array of MerchantUserRolesEntity objects matching the provided title.
	 */
	async findSharedMerchantUserRolesByTitle(title:string): Promise<MerchantUserRolesEntity[]>{
		await this.setRepository();
		const query= `SELECT * FROM ${MerchantUserRolesEntity.getTableName()} WHERE LOWER(title) = LOWER('${title}')`;

		const result = await this.merchantUserRolesRepository.query(query);
		return MapSnakeCaseToCamelCase(result);
	}
}
