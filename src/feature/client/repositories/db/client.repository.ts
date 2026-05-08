import {
  CustomRepository,
  DatasourceService,
} from "@app/core/db/datasource.service";
import { Page } from "@app/core/repository/search/page";
import { PageableInfo } from "@app/core/repository/search/pageable.info";
import { SortMeta, SortOrder } from "@app/core/repository/search/sort.meta";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { Injectable } from "@nestjs/common";
import { DynamicQueryBuilder } from "@app/core/repository/search/query-builder";
import { ClientRepository } from "../client.repository";
import { Client } from "../../entities/client.entity";

@Injectable()
export class ClientDbRepository implements ClientRepository {
  constructor(
    private dataSourceService: DatasourceService,
  ) { }

  private repository: CustomRepository<Client>;

  private async setRepository() {
    this.repository = await this.dataSourceService.getRepository(Client);
  }

  async insert(entity: Client): Promise<Client> {
    await this.setRepository();
    const clientAdd = await this.repository.insert(entity);
    return clientAdd.raw[0];
  }

  async update(entity: Partial<Client>): Promise<Client> {
    await this.setRepository();
    const updatedClient = await this.repository.update({ clientCode: entity.clientCode }, entity);
    return updatedClient.raw[0];
  }

  async delete(entity: Client): Promise<void> {
    await this.setRepository();
    await this.repository.delete({ clientCode: entity.clientCode });
  }

  async findById(id: any): Promise<Client> {
    await this.setRepository();
    const savedClient = await this.repository.findOneBy({ clientCode: id });
    return savedClient;
  }

  async findAll(): Promise<Client[]> {
    await this.setRepository();
    return this.repository.find();
  }

  async findTotalCount(): Promise<number> {
    await this.setRepository();
    const query = `SELECT count(client_code) as total FROM ${this.repository.schema
      }.${Client.getTableName()}`;
    const total = await this.repository.query(query);
    return parseInt(total[0]?.total || 0);
  }

  async findAllAndResponseWithPagination(
    filters: FilterConditionsDto,
    pageableInfo: any
  ): Promise<Page<any>> {
    await this.setRepository();

    const clientTable = Client.getTableName(); // e.g., cms_client
    const schema = this.repository.schema || 'public';

    // Build the WHERE conditions from filters dynamically
    let whereClause = "1=1";
    if (filters?.filters) {
      Object.keys(filters.filters).forEach((key) => {
        const value = filters.filters[key];
        whereClause += ` AND ${key} = '${value}'`;
      });
    }

    // Pagination calculations
    const page = pageableInfo.page || 1;
    const size = pageableInfo.size || 10;
    const offset = (page - 1) * size;

    // Raw SQL query
    const query = `
      SELECT 
        client_code,
        client_name
      FROM ${schema}."${clientTable}"
      WHERE ${whereClause}
      ORDER BY client_code ASC
      LIMIT ${size} OFFSET ${offset}
    `;

    // Execute raw query
    const clients = await this.repository.query(query);

    // Count total for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${schema}."${clientTable}"
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
      getElements: () => clients,
      getSortMetas: () => [new SortMeta("client_code", SortOrder.ASC)],
    };

    return pageResponse;
  }

  findWithFilters(filters: any): Promise<Client[]> {
    throw new Error("Method not implemented.");
  }

  findAllWithFilters(filters: any): Promise<Client[]> {
    throw new Error("Method not implemented.");
  }

  findTotalCountWithFilters(filters: any): Promise<number> {
    throw new Error("Method not implemented.");
  }

  findAllWithPagination(filters: any, pageableInfo: PageableInfo): Promise<Page<Client>> {
    throw new Error("Method not implemented.");
  }
}
