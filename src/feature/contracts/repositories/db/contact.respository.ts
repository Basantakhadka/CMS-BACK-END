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
import { Contract } from "../../entities/contracts.entity";
import { ContractRepository } from "../contract.repository";
import { Filter } from "@app/core/repository/search/filter";
import { DynamicQueryBuilder } from "@app/core/repository/search/query-builder";

@Injectable()
export class ContractDbRepository implements ContractRepository {
    constructor (private dataSourceService: DatasourceService) { }
    findByEmployeeId(employeeId: string): Promise<Contract> {
        throw new Error("Method not implemented.");
    }
    findUsersInIds(roles: string[]): Promise<Contract[]> {
        throw new Error("Method not implemented.");
    }
    findActiveUserID(userId: string): Promise<Contract> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Contract[]> {
        throw new Error("Method not implemented.");
    }
    findByContractId(userId: string): Promise<Contract> {
        throw new Error("Method not implemented.");
    }

    private repository: CustomRepository<Contract>;

    private async setRepository() {
        this.repository = await this.dataSourceService.getRepository(Contract);
    }

    async insert(entity: Contract): Promise<Contract> {
        await this.setRepository();
        const contractAdd = await this.repository.insert(entity);
        return contractAdd.raw[0];
    }
    async update(entity: Partial<Contract>): Promise<Contract> {
        await this.setRepository();
        const updatedContract = await this.repository.update({ id: entity.id }, entity);
        return updatedContract.raw[0];
    }
    async delete(entity: Contract): Promise<void> {
        await this.setRepository();
        await this.repository.update({ id: entity.id }, entity);
    }
    async findById(id: any): Promise<Contract> {
        await this.setRepository();
        const savedContract = await this.repository.findOneBy({
            id,
        });
        return savedContract;
    }
    findAllWithFilters(filters: SearchMeta): Promise<Contract[]> {
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
    ): Promise<Page<Contract>> {
        throw new Error("Method not implemented.");
    }

    async findTotalCount(): Promise<number> {
        await this.setRepository();
        const query = `SELECT count(id) as total FROM ${ this.repository.schema
            }.${ Contract.getTableName() } WHERE deleted = false`;
        const total = await this.repository.query(query);
        return parseInt(total[0]?.total || 0);
    }
    async findAllLabelValuePairByIds(list: string[]): Promise<LabelValuePair[]> {
        await this.setRepository();
        const query = `SELECT id as value, user_name as "userName",employee_id as "employeeId" from ${ this.repository.schema
            }.${ Contract.getTableName() } where id in ( ${ list.map((id) => `'${ id }'`) } )`;
        const usersList = await this.repository.query(query);
        return usersList?.map(
            (data) =>
                new LabelValuePair(data.userName + "-" + data.employeeId, data.value)
        );
    }
    async findAllAndResponseWithPagination(
        filters: FilterConditionsDto,
        pageableInfo: any
    ): Promise<Page<Contract>> {
        await this.setRepository();
        const queryBuilder = this.repository
            .createQueryBuilder()
            .where("deleted = false");
        const options: PaginationOptions = {
            columnsMap: null,
            defaultSortMeta: new SortMeta("createdAt,id", SortOrder.DESC),
            filters: filters.filters,
        };
        const pagination = new Pagination<Contract>(this.repository, pageableInfo);
        const page = pagination.paginate(queryBuilder, options);
        return page;
    }
}
