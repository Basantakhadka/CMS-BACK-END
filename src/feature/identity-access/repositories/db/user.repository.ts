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
import { Injectable } from "@nestjs/common";
import { User, UserByRole } from "../../entities/user.entity";
import { UserRepository } from "../user.repository";
import { Filter } from "@app/core/repository/search/filter";
import { DynamicQueryBuilder } from "@app/core/repository/search/query-builder";

@Injectable()
export class UserDbRepository implements UserRepository {
	constructor (private dataSourceService: DatasourceService) { }

	private repository: CustomRepository<User>;
	private userByRoleRepo: CustomRepository<UserByRole>;

	private async setRepository() {
		this.repository = await this.dataSourceService.getRepository(User);
		this.userByRoleRepo = await this.dataSourceService.getRepository(
			UserByRole
		);
	}

	async insert(entity: User): Promise<User> {
		await this.setRepository();
		const addedUser = await this.repository.insert(entity);
		return addedUser.raw[0];
	}
	async update(entity: Partial<User>): Promise<User> {
		await this.setRepository();
		const updatedUser = await this.repository.update({ id: entity.id }, entity);
		return updatedUser.raw[0];
	}
	async delete(entity: User): Promise<void> {
		await this.setRepository();
		await this.repository.update({ id: entity.id }, entity);
	}
	async findById(id: string): Promise<User> {
		await this.setRepository();
		const savedUser = await this.repository.findOneBy({
			id,
		});
		return savedUser;
	}
	async findByUserId(userId: string): Promise<any> {
		await this.setRepository();
		const result = await this.repository.findOneBy({ userId, deleted: false });
		return result;
	}
	async findActiveUserID(userId: string): Promise<User> {
		await this.setRepository();
		const result = await this.repository.findOneBy({ userId, deleted: false });
		return result;
	}
	findAllWithFilters(filters: SearchMeta): Promise<User[]> {
		throw new Error("Method not implemented.");
	}
	async findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
		await this.setRepository();
		const queryBuilder = this.repository.createQueryBuilder().where("deleted = false");
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
		const result = await this.repository.findBy({ deleted: false });
		return result;
	}
	async findTotalCount(): Promise<number> {
		await this.setRepository();
		const query = `SELECT count(id) as total FROM ${ this.repository.schema
			}.${ User.getTableName() } WHERE deleted = false`;
		const total = await this.repository.query(query);
		return parseInt(total[0]?.total || 0);
	}
	async findAllLabelValuePairByIds(list: string[]): Promise<LabelValuePair[]> {
		await this.setRepository();
		const query = `SELECT id as value, user_name as "userName",employee_id as "employeeId" from ${ this.repository.schema
			}.${ User.getTableName() } where id in ( ${ list.map((id) => `'${ id }'`) } )`;
		const usersList = await this.repository.query(query);
		return usersList?.map(
			(data) =>
				new LabelValuePair(data.userName + "-" + data.employeeId, data.value)
		);
	}
	async insertUserByRole(entity: UserByRole): Promise<UserByRole> {
		await this.setRepository();
		await this.userByRoleRepo.insert(entity);
		return entity;
	}
	async findUsersByRoleId(roleId: string): Promise<UserByRole[]> {
		await this.setRepository();
		return await this.userByRoleRepo.findBy({ roleId: roleId });
	}
	async findAllAndResponseWithPagination(
		filters: FilterConditionsDto,
		pageableInfo: any
	): Promise<Page<User>> {
		await this.setRepository();
		const queryBuilder = this.repository
			.createQueryBuilder()
			.where("deleted = false");
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
		const result = await this.repository.findOneBy({ employeeId, deleted: false });
		return result;
	}
	async deleteUsersByRole(roleId: string, userId?: string): Promise<void> {
		await this.setRepository();
		await this.userByRoleRepo.delete({ roleId, userId });
	}
	async findSavedUsersRoles(userId: string): Promise<UserByRole[]> {
		await this.setRepository();
		return await this.userByRoleRepo.findBy({ userId });
	}
	async findUsersInIds(roles: string[]): Promise<User[]> {
		const query = `SELECT * from ${ this.repository.schema }.${ User.getTableName() } WHERE deleted = false and id IN (${ roles.map(id => `'${ id }'`) })`;
		const usersList = await this.repository.query(query);
		return usersList;
	}
}
