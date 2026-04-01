import { UsecaseRequest } from "@app/core/usecase/usecase.request";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";

export class GetContractChangeRequestListUsecaseRequest implements UsecaseRequest {
    constructor (
        public readonly filters: FilterConditionsDto,
    ) { }
}
