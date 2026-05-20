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
import { Contract } from "../../entities/contracts.entity";
import { ContractRepository } from "../contract.repository";
import { Filter } from "@app/core/repository/search/filter";
import { DynamicQueryBuilder } from "@app/core/repository/search/query-builder";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";

@Injectable()
export class ContractDbRepository implements ContractRepository {
    constructor (
        private dataSourceService: DatasourceService,
        private readonly als: AsyncLocalStorage<RequestContext>,
    ) { }
    findByEmployeeId(employeeId: string): Promise<Contract> {
        throw new Error("Method not implemented.");
    }
    findUsersInIds(roles: string[]): Promise<Contract[]> {
        throw new Error("Method not implemented.");
    }
    findActiveUserID(userId: string): Promise<Contract> {
        throw new Error("Method not implemented.");
    }

    findByContractId(userId: string): Promise<Contract> {
        throw new Error("Method not implemented.");
    }

    private repository: CustomRepository<Contract>;

    private getClientCode(strict = true) {
        const clientCode = this.als.getStore()?.getCurrentUser()?.clientCode;
        if (!clientCode && strict) {
            throw new UnauthorizedException('Missing client context');
        }
        return clientCode;
    }

    private async setRepository() {
        this.repository = await this.dataSourceService.getRepository(Contract);
    }
    async findAll(): Promise<any> {
        await this.setRepository();
        const clientCode = this.getClientCode();
        return await this.repository.findBy({ deleted: false, client_code: clientCode });
    }
    async insert(entity: Contract): Promise<Contract> {
        await this.setRepository();
        const clientCode = entity.client_code || this.getClientCode();
        entity.client_code = clientCode;
        const contractAdd = await this.repository.insert(entity);
        return contractAdd.raw[0];
    }
    async update(entity: Partial<Contract>): Promise<Contract> {
        await this.setRepository();
        const clientCode = this.getClientCode();
        const updatedContract = await this.repository.update({ id: entity.id, client_code: clientCode }, entity);
        return updatedContract.raw[0];
    }
    async delete(entity: Contract): Promise<void> {
        await this.setRepository();
        const clientCode = this.getClientCode();
        await this.repository.update({ id: entity.id, client_code: clientCode }, entity);
    }
    async findById(id: any): Promise<Contract> {
        await this.setRepository();
        const clientCode = this.getClientCode(false);
        const criteria: any = { id };
        if (clientCode) {
            criteria.client_code = clientCode;
        }
        const savedContract = await this.repository.findOneBy(criteria);
        return savedContract;
    }
    findAllWithFilters(filters: SearchMeta): Promise<Contract[]> {
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
    ): Promise<Page<Contract>> {
        throw new Error("Method not implemented.");
    }

    async findTotalCount(): Promise<number> {
        await this.setRepository();
        const clientCode = this.getClientCode();
        const query = `SELECT count(id) as total FROM ${ this.repository.schema
            }.${ Contract.getTableName() } WHERE deleted = false AND client_code = $1`;
        const total = await this.repository.query(query, [clientCode]);
        return parseInt(total[0]?.total || 0);
    }
    async findAllLabelValuePairByIds(list: string[]): Promise<LabelValuePair[]> {
        await this.setRepository();
        const clientCode = this.getClientCode();
        const placeholders = list.map((_, index) => `$${ index + 2 }`).join(",");
        const query = `SELECT id as value, contract_title as "title" from ${ this.repository.schema
            }.${ Contract.getTableName() } where client_code = $1 and id in (${ placeholders })`;
        const usersList = await this.repository.query(query, [clientCode, ...list]);
        return usersList?.map(
            (data) => new LabelValuePair(data.title, data.value)
        );
    }
    async findAllAndResponseWithPagination(
        filters: FilterConditionsDto,
        pageableInfo: any,
        contractIds?: string[]
    ): Promise<Page<Contract>> {
        await this.setRepository();
        const clientCode = this.getClientCode();
        const queryBuilder = this.repository
            .createQueryBuilder()
            .where("deleted = false")
            .andWhere("client_code = :clientCode", { clientCode });

        if (contractIds && contractIds.length > 0) {
            queryBuilder.andWhere("id IN (:...contractIds)", { contractIds });
        }

        const options: PaginationOptions = {
            columnsMap: null,
            defaultSortMeta: new SortMeta("createdAt,id", SortOrder.DESC),
            filters: filters.filters,
        };
        const pagination = new Pagination<Contract>(this.repository, pageableInfo);
        const page = pagination.paginate(queryBuilder, options);
        return page;
    }

async autoRenewContracts(): Promise<number> {
    await this.setRepository();
    const clientCode = this.getClientCode(false);
    const params: any[] = [];
    let clientCondition = '';
    if (clientCode) {
        clientCondition = ' AND client_code = $1';
        params.push(clientCode);
    }

    const query = `
        UPDATE ${this.repository.schema}.${Contract.getTableName()}
        SET expiry_date = expiry_date + (expiry_date - contract_date),
            updated_at = NOW()
        WHERE renewal_terms = 'Auto'
          AND deleted = false
          AND expiry_date <= CURRENT_DATE
          ${clientCondition}
        RETURNING id;
    `;

    const result = await this.repository.query(query, params);

    return result.length; // number of contracts renewed
}

}
