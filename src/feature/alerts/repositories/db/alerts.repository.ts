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
import { Filter } from "@app/core/repository/search/filter";
import { DynamicQueryBuilder } from "@app/core/repository/search/query-builder";
import { ContractAlertsRepository } from "../alerts.repository";
import { ContractAlert } from "../../entities/alerts.entity";
import { Contract } from "@app/feature/contracts/entities/contracts.entity";

@Injectable()
export class ContractAlertsDbRepository implements ContractAlertsRepository {
    constructor(private dataSourceService: DatasourceService) { }
    async findByAlertsId(alertsId: string): Promise<ContractAlert> {
        await this.setRepository();
        return this.repository.findOneBy({ id: alertsId });
    }

    findUsersInIds(roles: string[]): Promise<ContractAlert[]> {
        throw new Error("Method not implemented.");
    }
    findActiveUserID(userId: string): Promise<ContractAlert> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<ContractAlert[]> {
        throw new Error("Method not implemented.");
    }
    findByContractId(userId: string): Promise<ContractAlert> {
        throw new Error("Method not implemented.");
    }

    private repository: CustomRepository<ContractAlert>;

    private async setRepository() {
        this.repository = await this.dataSourceService.getRepository(ContractAlert);
    }

    async insert(entity: ContractAlert): Promise<ContractAlert> {
        await this.setRepository();
        const contractAdd = await this.repository.insert(entity);
        return contractAdd.raw[0];
    }
    async update(entity: Partial<ContractAlert>): Promise<ContractAlert> {
        await this.setRepository();
        const updatedContract = await this.repository.update({ id: entity.id }, entity);
        return updatedContract.raw[0];
    }
    async delete(entity: ContractAlert): Promise<void> {
        await this.setRepository();
        await this.repository.update({ id: entity.id }, entity);
    }
    async findById(id: any): Promise<ContractAlert> {
        await this.setRepository();
        const savedContract = await this.repository.findOneBy({
            id,
        });
        return savedContract;
    }
    findAllWithFilters(filters: SearchMeta): Promise<ContractAlert[]> {
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
    ): Promise<Page<ContractAlert>> {
        throw new Error("Method not implemented.");
    }

    async findTotalCount(): Promise<number> {
        await this.setRepository();
        const query = `SELECT count(id) as total FROM ${this.repository.schema
            }.${ContractAlert.getTableName()} WHERE deleted = false`;
        const total = await this.repository.query(query);
        return parseInt(total[0]?.total || 0);
    }
    async findAllLabelValuePairByIds(list: string[]): Promise<LabelValuePair[]> {
        await this.setRepository();
        const query = `SELECT id as value, user_name as "userName",employee_id as "employeeId" from ${this.repository.schema
            }.${ContractAlert.getTableName()} where id in ( ${list.map((id) => `'${id}'`)} )`;
        const usersList = await this.repository.query(query);
        return usersList?.map(
            (data) =>
                new LabelValuePair(data.userName + "-" + data.employeeId, data.value)
        );
    }
    async findAllAndResponseWithPagination(
        filters: FilterConditionsDto,
        pageableInfo: any
    ): Promise<Page<any>> {
        await this.setRepository();

        const alertTable = ContractAlert.getTableName(); // e.g., cms_contract_alerts
        const contractTable = Contract.getTableName();   // e.g., cms_contracts
        const schema = this.repository.schema || 'public';

        // Build the WHERE conditions from filters dynamically
        let whereClause = "a.deleted = false";
        if (filters?.filters) {
            Object.keys(filters.filters).forEach((key) => {
                const value = filters.filters[key];
                whereClause += ` AND a.${key} = '${value}'`;
            });
        }

        // Pagination calculations
        const page = pageableInfo.page || 1;
        const size = pageableInfo.size || 10;
        const offset = (page - 1) * size;

        // Raw SQL query
        const query = `
  SELECT 
    a.id,
    a.reminder_interval,
    a.stakeholders::jsonb,
    a.communication_channels::jsonb,
    a.created_at,
    a.updated_at,
    c.id AS contract_id,
    c.contract_title,
    c.expiry_date
  FROM ${schema}."${alertTable}" a
  INNER JOIN ${schema}."${contractTable}" c
    ON c.id = a.contract_id
 and a.deleted = false
  WHERE ${whereClause}
  ORDER BY a.created_at DESC
  LIMIT ${size} OFFSET ${offset}
`;

        // Execute raw query
        const alerts = await this.repository.query(query);

        // Count total for pagination
        const countQuery = `
        SELECT COUNT(*) as total
        FROM ${schema}."${alertTable}" a
        INNER JOIN ${schema}."${contractTable}" c
            ON c.id = a.contract_id AND c.deleted = false
        WHERE ${whereClause}
    `;
        const totalResult = await this.repository.query(countQuery);
        const totalElements = parseInt(totalResult[0]?.total || 0);

        // Build Page object
        const pageResponse: Page<any> = {
            getTotalPages: () => Math.ceil(totalElements / size),
            getCurrentPage: () => page,
            getSize: () => size,
            getTotalElements: () => totalElements,
            getElements: () => alerts,
            getSortMetas: () => [new SortMeta("createdAt,id", SortOrder.DESC)],
        };

        return pageResponse;
    }


    async findActiveExpiryAlertsWithContract(): Promise<
        {
            alertId: string;
            reminderInterval: number;
            contractId: string;
            expiryDate: Date;
            title: string;
            stakeholders: string[]; // if you store them as array in DB
        }[]
    > {
        await this.setRepository();

        const alertTable = ContractAlert.getTableName(); // e.g., cms_contract_alerts
        const contractTable = Contract.getTableName();   // e.g., cms_contracts
        const schema = this.repository.schema || 'public'; // your schema

        // Raw SQL query
        const query = `
    SELECT 
      a.id AS "alertId",
      a.reminder_interval AS "reminderInterval",
      a.stakeholders AS "stakeholders",
      c.id AS "contractId",
      c.contract_title AS "title",
      c.expiry_date AS "expiryDate"
    FROM ${schema}."${alertTable}" a
    INNER JOIN ${schema}."${contractTable}" c
      ON c.id = a.contract_id
      AND c.deleted = false
    WHERE a.deleted = false
    
  `;

        const results = await this.repository.query(query);

        return results;
    }






}
