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
import { DynamicQueryBuilder } from "@app/core/repository/search/query-builder";
import { Injectable } from "@nestjs/common";
import { Client } from "../../entities/client.entity";
import { ClientRepository } from "../client.repository";

@Injectable()
export class ClientDbRepository implements ClientRepository {
    constructor (private readonly datasourceService: DatasourceService) { }

    private repository: CustomRepository<Client>;

    private async setRepository() {
        this.repository = await this.datasourceService.getRepository(Client);
    }

    async insert(entity: Client): Promise<Client> {
        await this.setRepository();
        const result = await this.repository.insert(entity);
        return result.raw[0];
    }

    async update(entity: Partial<Client>): Promise<Client> {
        await this.setRepository();
        const result = await this.repository.update({ clientCode: entity.clientCode }, entity);
        return result.raw[0];
    }

    async delete(entity: Client): Promise<void> {
        await this.setRepository();
        await this.repository.update({ clientCode: entity.clientCode }, entity);
    }

    async findById(id: string): Promise<Client> {
        await this.setRepository();
        return this.repository.findOneBy({ clientCode:id });
    }

    async findByCode(clientCode: string): Promise<Client> {
        await this.setRepository();
        return this.repository.findOneBy({ clientCode });
    }

    async findAll(): Promise<Client[]> {
        await this.setRepository();
        return this.repository.find();
    }

    // async findAllActive(): Promise<Client[]> {
    //     await this.setRepository();
    //     return this.repository.findBy({ active: true });
    // }

    async findAllWithFilters(filters: SearchMeta): Promise<Client[]> {
        await this.setRepository();
        const queryBuilder = this.repository.createQueryBuilder();
        const filteredQuery = new DynamicQueryBuilder<Client>(queryBuilder).applyFilters(
            filters?.filters || []
        );
        return filteredQuery.getMany();
    }

    async findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
        await this.setRepository();
        const queryBuilder = this.repository.createQueryBuilder();
        const filteredQuery = new DynamicQueryBuilder<Client>(queryBuilder).applyFilters(
            filters?.filters || []
        );
        return filteredQuery.getCount();
    }

    async findAllWithPagination(
        filters: SearchMeta,
        pageableInfo: PageableInfo
    ): Promise<Page<Client>> {
        await this.setRepository();
        const queryBuilder = this.repository.createQueryBuilder();
        const options: PaginationOptions = {
            columnsMap: null,
            defaultSortMeta: new SortMeta("createdOn,id", SortOrder.DESC),
            filters: filters?.filters || [],
        };
        const pagination = new Pagination<Client>(this.repository, pageableInfo);
        return pagination.paginate(queryBuilder, options);
    }

    async findTotalCount(): Promise<number> {
        await this.setRepository();
        const query = `SELECT count(id) as total FROM ${ this.repository.schema }.${ Client.getTableName() }`;
        const total = await this.repository.query(query);
        return parseInt(total?.[0]?.total ?? "0", 10);
    }
}
