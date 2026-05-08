import { BaseRepository } from "@app/core/repository/base.repository";
import { Page } from "@app/core/repository/search/page";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { Client } from "../entities/client.entity";


export interface ClientRepository extends BaseRepository<Client, string> {
  findAllAndResponseWithPagination(
    filters: FilterConditionsDto,
    pageableInfo: any
  ): Promise<Page<Client>>;
}
