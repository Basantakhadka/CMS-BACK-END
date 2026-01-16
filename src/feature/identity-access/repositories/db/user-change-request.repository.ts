import {
	CustomRepository,
	DatasourceService,
} from "CMS-BACK-END/src/core/db/datasource.service";
import { Page } from "CMS-BACK-END/src/core/repository/search/page";
import { PageableInfo } from "CMS-BACK-END/src/core/repository/search/pageable.info";
import {
	Pagination,
	PaginationOptions,
} from "CMS-BACK-END/src/core/repository/search/pagination";
import { SearchMeta } from "CMS-BACK-END/src/core/repository/search/search.meta";
import { SortMeta, SortOrder } from "CMS-BACK-END/src/core/repository/search/sort.meta";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { FilterConditionsDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { Injectable } from "@nestjs/common";
import { UserChangeRequest } from "../../entities/user-change-request.entity";
import { UserChangeRequestRepository } from "../user-change-request.repository";

@Injectable()
export class UserChangeRequestDbRepository
	implements UserChangeRequestRepository
{
	constructor(private dataSourceService: DatasourceService) {}

	repository: CustomRepository<UserChangeRequest>;
	private async setRepository() {
		this.repository = await this.dataSourceService.getRepository(
			UserChangeRequest
		);
	}
	async insert(entity: UserChangeRequest): Promise<UserChangeRequest> {
		await this.setRepository();
		const addedUserChangeRequest = await this.repository.insert(entity);
		return addedUserChangeRequest.raw[0];
	}
	async update(entity: Partial<UserChangeRequest>): Promise<UserChangeRequest> {
		await this.setRepository();
		const updatedUserChangeRequest = await this.repository.update(
			{ refId: entity.refId, id: entity.id },
			entity
		);
		return updatedUserChangeRequest.raw[0];
	}
	async delete(entity: UserChangeRequest): Promise<void> {
		await this.setRepository();
		await this.repository.update(
			{ refId: entity.refId, id: entity.id },
			entity
		);
	}
	async findById(id: string): Promise<UserChangeRequest> {
		await this.setRepository();
		const savedUserChangeRequest = await this.repository.findOneBy({
			id,
		});
		return savedUserChangeRequest;
	}
	findAllWithFilters(filters: SearchMeta): Promise<UserChangeRequest[]> {
		throw new Error("Method not implemented.");
	}
	findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
		throw new Error("Method not implemented.");
	}
	findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo
	): Promise<Page<UserChangeRequest>> {
		throw new Error("Method not implemented.");
	}
	async findAll(): Promise<UserChangeRequest[]> {
		await this.setRepository();
		const result = await this.repository.findBy({
			changeRequestStatus: ChangeRequestOutcomeStatus.IN_PROGRESS.name,
		});
		return result;
	}
	async findTotalCount(): Promise<number> {
		await this.setRepository();
		const query = `SELECT count(id) as total FROM ${
			this.repository.schema
		}.${UserChangeRequest.getTableName()} WHERE change_request_status = '${
			ChangeRequestOutcomeStatus.IN_PROGRESS.name
		}'`;
		const total = await this.repository.query(query);
		return parseInt(total[0]?.total || 0);
	}
	async findByIds(entity: UserChangeRequest): Promise<UserChangeRequest[]> {
		await this.setRepository();
		const savedUserChangeRequest = await this.repository.findBy({
			refId: entity.refId,
			id: entity.id,
		});
		return savedUserChangeRequest;
	}
	async findChangeRequestByRefIdAndRequestId(
		refId: string,
		changeRequestId: string
	): Promise<UserChangeRequest> {
		await this.setRepository();
		return await this.repository.findOneBy({
			refId: refId,
			id: changeRequestId,
		});
	}
	async findAllAndResponseWithPagination(
		filters: FilterConditionsDto,
		pageableInfo: PageableInfo
	): Promise<Page<UserChangeRequest>> {
		await this.setRepository();
		const queryBuilder = this.repository
			.createQueryBuilder()
			.where(`change_request_status = '${ChangeRequestOutcomeStatus.IN_PROGRESS.name}'`);
		const options: PaginationOptions = {
			defaultSortMeta: new SortMeta("requestedOn,id", SortOrder.DESC),
			columnsMap: null,
			filters: filters.filters,
		};
		const pagination = new Pagination<UserChangeRequest>(
			this.repository,
			pageableInfo
		);
		const page = pagination.paginate(queryBuilder, options);
		return page;
	}
	async findByUserId(userId: string): Promise<UserChangeRequest> {
		await this.setRepository();
		const result = await this.repository.findOneBy({
			changeRequestStatus: ChangeRequestOutcomeStatus.IN_PROGRESS.name,
			userId,
		});
		return result;
	}

	async findByEmployeeId(employeeId: string): Promise<UserChangeRequest> {
		await this.setRepository();
		const result = await this.repository.findOneBy({
			changeRequestStatus: ChangeRequestOutcomeStatus.IN_PROGRESS.name,
			employeeId,
		});
		return result;
	}

	async findCountByRefIdAndChangeRequestStatus(
		refId: string,
		changeRequestStatus: string
	): Promise<number> {
		await this.setRepository();
		const query = `SELECT COUNT(*) as rowcount FROM ${
			this.repository.schema
		}.${UserChangeRequest.getTableName()} WHERE ref_id = '${refId}' AND change_request_status = '${changeRequestStatus}'`;
		const count = await this.repository.query(query);
		return parseInt(count[0]?.rowcount || 0);
	}
}
