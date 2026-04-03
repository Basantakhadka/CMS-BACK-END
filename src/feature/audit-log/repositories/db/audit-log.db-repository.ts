import {
	CustomRepository,
	DatasourceService,
} from "@app/core/db/datasource.service";
import { Page } from "@app/core/repository/search/page";
import { PageableInfo } from "@app/core/repository/search/pageable.info";
import {
	Pagination,
	PaginationOptions,
} from "@app/core/repository/search/pagination";
import { SearchMeta } from "@app/core/repository/search/search.meta";
import { SortMeta, SortOrder } from "@app/core/repository/search/sort.meta";
import { DynamicFiltersDto } from "@app/shared/dtos/filter-conditions.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";
import { AuditLog } from "../../entities/audit-log.entity";
import { AuditLogRepository } from "../audit-log.repository";

@Injectable()
export class AuditLogDbRepository implements AuditLogRepository {
	private repository!: CustomRepository<AuditLog>;

	constructor(
		private readonly dataSourceService: DatasourceService,
		private readonly als: AsyncLocalStorage<RequestContext>,
	) {}

	private getClientCode(strict = true): string {
		const clientCode = this.als.getStore()?.getCurrentUser()?.clientCode;
		if (!clientCode && strict) {
			throw new UnauthorizedException("Missing client context");
		}
		return clientCode as string;
	}

	private async setRepository(): Promise<void> {
		this.repository = await this.dataSourceService.getRepository(AuditLog);
	}

	async insert(entity: AuditLog): Promise<AuditLog> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		entity.clientCode = clientCode;
		const result = await this.repository.insert(entity);
		return result.raw[0] ?? entity;
	}

	async update(entity: Partial<AuditLog>): Promise<AuditLog> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const result = await this.repository.update({ id: entity.id, clientCode }, entity);
		return result.raw[0];
	}

	async delete(entity: AuditLog): Promise<void> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		await this.repository.delete({ id: entity.id, clientCode });
	}

	async findById(id: string): Promise<AuditLog> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		return this.repository.findOneBy({ id, clientCode }) as Promise<AuditLog>;
	}

	async findAll(): Promise<AuditLog[]> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		return this.repository.findBy({ clientCode });
	}

	async findTotalCount(): Promise<number> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const result = await this.repository.query(
			`SELECT count(id) AS total FROM ${this.repository.schema}.${AuditLog.getTableName()} WHERE client_code = $1`,
			[clientCode],
		);
		return parseInt(result[0]?.total ?? 0);
	}

	findAllWithFilters(filters: SearchMeta): Promise<AuditLog[]> {
		throw new Error("Method not implemented.");
	}

	findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
		throw new Error("Method not implemented.");
	}

	findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo,
	): Promise<Page<AuditLog>> {
		throw new Error("Method not implemented.");
	}

	async findAllWithDynamicFilters(filters: DynamicFiltersDto): Promise<Page<AuditLog>> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const queryBuilder = this.repository
			.createQueryBuilder()
			.where("client_code = :clientCode", { clientCode });

		const options: PaginationOptions = {
			defaultSortMeta: new SortMeta("performedAt,id", SortOrder.DESC),
			columnsMap: new AuditLog().getColumns?.() ?? null,
			filters: filters.filters ?? [],
		};

		const pagination = new Pagination<AuditLog>(this.repository, filters.pageInfo as any);
		return pagination.paginate(queryBuilder, options);
	}

	async findByActorUserId(actorUserId: string, pageInfo?: any): Promise<Page<AuditLog>> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const queryBuilder = this.repository
			.createQueryBuilder()
			.where("client_code = :clientCode", { clientCode })
			.andWhere("actor_user_id = :actorUserId", { actorUserId });

		const options: PaginationOptions = {
			defaultSortMeta: new SortMeta("performedAt,id", SortOrder.DESC),
			columnsMap: new AuditLog().getColumns?.() ?? null,
			filters: [],
		};

		const pagination = new Pagination<AuditLog>(this.repository, pageInfo);
		return pagination.paginate(queryBuilder, options);
	}
}
