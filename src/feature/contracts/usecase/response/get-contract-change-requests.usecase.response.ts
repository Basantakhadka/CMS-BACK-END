import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { ContractChangeRequestListItemDto } from "@app/feature/contracts/dtos/contract-change-request-list.dto";

export class GetContractChangeRequestListUsecaseResponse implements UsecaseResponse {
    constructor (
        public readonly list: ContractChangeRequestListItemDto[],
        public readonly pageInfo: PageInfoDto,
    ) { }
}
