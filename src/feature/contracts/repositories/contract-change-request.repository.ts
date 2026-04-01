import { Page } from "@app/core/repository/search/page";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { ContractChangeRequest } from "../entities/contract-change-request.entity";

export interface ContractChangeRequestRepository {
    insert(entity: ContractChangeRequest): Promise<ContractChangeRequest>;
    update(entity: Partial<ContractChangeRequest>): Promise<ContractChangeRequest>;
    delete(entity: ContractChangeRequest): Promise<void>;
    findById(id: string): Promise<ContractChangeRequest>;
    findAllAndResponseWithPagination(
        filters: FilterConditionsDto,
        pageableInfo: any,
    ): Promise<Page<ContractChangeRequest>>;
}
