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
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { LabelValuePair } from "@app/shared/entities/label-value-pair.view";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User, UserByRole } from "../../entities/user.entity";
import { UserRepository } from "../user.repository";
import { Filter } from "@app/core/repository/search/filter";
import { DynamicQueryBuilder } from "@app/core/repository/search/query-builder";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";

@Injectable()
export class UserDbRepository implements UserRepository {
	constructor (
		private dataSourceService: DatasourceService,
		private readonly als: AsyncLocalStorage<RequestContext>,
	) { }

	private repository: CustomRepository<User>;
	private userByRoleRepo: CustomRepository<UserByRole>;

	private getClientCode(strict = true) {
		const clientCode = this.als.getStore()?.getCurrentUser()?.clientCode;
		if (!clientCode && strict) {
			throw new UnauthorizedException('Missing client context');
		}
		return clientCode;
	}

	private async setRepository() {
		this.repository = await this.dataSourceService.getRepository(User);
		this.userByRoleRepo = await this.dataSourceService.getRepository(
			UserByRole
		);
	}

	async insert(entity: User): Promise<User> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		entity.clientCode = clientCode;
		const addedUser = await this.repository.insert(entity);
		return addedUser.raw[0];
	}
	async update(entity: Partial<User>): Promise<User> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const updatedUser = await this.repository.update({ id: entity.id, clientCode }, entity);
		return updatedUser.raw[0];
	}
	async delete(entity: User): Promise<void> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		await this.repository.update({ id: entity.id, clientCode }, entity);
	}
	async findById(id: string): Promise<User> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const savedUser = await this.repository.findOneBy({
			id,
			clientCode,
		});
		return savedUser;
	}
	async findByUserId(userId: string): Promise<any> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const criteria: any = { userId, deleted: false };
		if (clientCode) {
			criteria.clientCode = clientCode;
		}
		const result = await this.repository.findOneBy(criteria);
		return result;
	}
	async findActiveUserID(userId: string): Promise<User> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const criteria: any = { userId, deleted: false };
		if (clientCode) {
			criteria.clientCode = clientCode;
		}
		const result = await this.repository.findOneBy(criteria);
		return result;
	}
	findAllWithFilters(filters: SearchMeta): Promise<User[]> {
		throw new Error("Method not implemented.");
	}
	async findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const queryBuilder = this.repository
			.createQueryBuilder()
			.where("deleted = false")
			.andWhere("client_code = :clientCode", { clientCode });
		const dynamicBuilder = new DynamicQueryBuilder(queryBuilder).applyFilters(
			filters.filters
		);
		return await dynamicBuilder.getCount();
	}
	async findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo
	): Promise<Page<User>> {
		throw new Error("Method not implemented.");
	}
	async findAll(): Promise<any> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const result = await this.repository.findBy({ deleted: false, clientCode });
		return result;
	}
	async findTotalCount(): Promise<number> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const query = `SELECT count(id) as total FROM ${ this.repository.schema
			}.${ User.getTableName() } WHERE deleted = false AND client_code = $1`;
		const total = await this.repository.query(query, [clientCode]);
		return parseInt(total[0]?.total || 0);
	}
	async findAllLabelValuePairByIds(list: string[]): Promise<LabelValuePair[]> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const placeholders = list
			.map((_, index) => `$${ index + 2 }`)
			.join(",");
		const query = `SELECT id as value, user_name as "userName",employee_id as "employeeId" from ${ this.repository.schema
			}.${ User.getTableName() } where client_code = $1 and id in (${ placeholders })`;
		const usersList = await this.repository.query(query, [clientCode, ...list]);
		return usersList?.map(
			(data) =>
				new LabelValuePair(data.userName + "-" + data.employeeId, data.value)
		);
	}
	async insertUserByRole(entity: UserByRole): Promise<UserByRole> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		entity.clientCode = clientCode;
		await this.userByRoleRepo.insert(entity);
		return entity;
	}
	async findUsersByRoleId(roleId: string): Promise<UserByRole[]> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		return await this.userByRoleRepo.findBy({ roleId: roleId, clientCode });
	}
	async findAllAndResponseWithPagination(
		filters: FilterConditionsDto,
		pageableInfo: any
	): Promise<Page<User>> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		const queryBuilder = this.repository
			.createQueryBuilder()
			.where("deleted = false")
			.andWhere("client_code = :clientCode", { clientCode });
		const options: PaginationOptions = {
			columnsMap: null,
			defaultSortMeta: new SortMeta("createdOn,id", SortOrder.DESC),
			filters: filters.filters,
		};
		const pagination = new Pagination<User>(this.repository, pageableInfo);
		const page = pagination.paginate(queryBuilder, options);
		return page;
	}

	async findByEmployeeId(employeeId: string): Promise<User> {
		await this.setRepository();
		const clientCode = this.getClientCode(false);
		const criteria: any = { employeeId, deleted: false };
		if (clientCode) {
			criteria.clientCode = clientCode;
		}
		const result = await this.repository.findOneBy(criteria);
		return result;
	}
	async deleteUsersByRole(roleId: string, userId?: string): Promise<void> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		await this.userByRoleRepo.delete({ roleId, userId, clientCode });
	}
	async findSavedUsersRoles(userId: string): Promise<UserByRole[]> {
		await this.setRepository();
		const clientCode = this.getClientCode();
		return await this.userByRoleRepo.findBy({ userId, clientCode });
	}
	async findUsersInIds(roles: string[]): Promise<User[]> {
		const clientCode = this.getClientCode();
		const placeholders = roles.map((_, index) => `$${ index + 2 }`).join(",");
		const query = `SELECT * from ${ this.repository.schema }.${ User.getTableName() } WHERE deleted = false and client_code = $1 and id IN (${ placeholders })`;
		const usersList = await this.repository.query(query, [clientCode, ...roles]);
		return usersList;
	}
}
