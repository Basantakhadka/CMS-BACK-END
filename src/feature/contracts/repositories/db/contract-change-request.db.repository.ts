import {
    CustomRepository,
    DatasourceService,
} from "@app/core/db/datasource.service";
import { RequestContext } from "@app/core/middleware/request_context";
import { Page } from "@app/core/repository/search/page";
import {
    Pagination,
    PaginationOptions,
} from "@app/core/repository/search/pagination";
import { SortMeta, SortOrder } from "@app/core/repository/search/sort.meta";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ContractChangeRequest } from "../../entities/contract-change-request.entity";
import { ContractChangeRequestRepository } from "../contract-change-request.repository";
import { AsyncLocalStorage } from "async_hooks";

@Injectable()
export class ContractChangeRequestDbRepository implements ContractChangeRequestRepository {
    constructor (
        private readonly dataSourceService: DatasourceService,
        private readonly als: AsyncLocalStorage<RequestContext>,
    ) { }

    private repository: CustomRepository<ContractChangeRequest>;

    private async setRepository() {
        this.repository = await this.dataSourceService.getRepository(ContractChangeRequest);
    }

    private getClientCode(strict = true) {
        const clientCode = this.als.getStore()?.getCurrentUser()?.clientCode;
        if (!clientCode && strict) {
            throw new UnauthorizedException("Missing client context");
        }
        return clientCode;
    }

    async insert(entity: ContractChangeRequest): Promise<ContractChangeRequest> {
        await this.setRepository();
        const clientCode = entity.client_code || this.getClientCode();
        entity.client_code = clientCode;
        const result = await this.repository.insert(entity);
        return result.raw[0];
    }

    async update(entity: Partial<ContractChangeRequest>): Promise<ContractChangeRequest> {
        await this.setRepository();
        const clientCode = this.getClientCode();
        const result = await this.repository.update({ id: entity.id, client_code: clientCode }, entity);
        return result.raw[0];
    }

    async delete(entity: ContractChangeRequest): Promise<void> {
        await this.setRepository();
        const clientCode = this.getClientCode();
        await this.repository.delete({ id: entity.id, client_code: clientCode });
    }

    async findById(id: string): Promise<ContractChangeRequest> {
        await this.setRepository();
        const clientCode = this.getClientCode(false);
        const criteria: Record<string, any> = { id };
        if (clientCode) {
            criteria.client_code = clientCode;
        }
        return await this.repository.findOneBy(criteria);
    }

    async findAllAndResponseWithPagination(
        filters: FilterConditionsDto,
        pageableInfo: any,
    ): Promise<Page<ContractChangeRequest>> {
        await this.setRepository();
        const clientCode = this.getClientCode();
        const filterConditions = filters ?? { filters: [] } as FilterConditionsDto;
        const queryBuilder = this.repository
            .createQueryBuilder()
            .where("client_code = :clientCode", { clientCode });

        const options: PaginationOptions = {
            columnsMap: null,
            defaultSortMeta: new SortMeta("requested_at,id", SortOrder.DESC),
            filters: filterConditions?.filters,
        };

        const pagination = new Pagination<ContractChangeRequest>(this.repository, pageableInfo ?? filterConditions?.pageInfo);
        return pagination.paginate(queryBuilder, options);
    }
}
