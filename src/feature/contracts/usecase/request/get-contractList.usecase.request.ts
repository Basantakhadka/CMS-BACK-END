
import { UsecaseRequest } from "@app/core/usecase/usecase.request";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";

export class GetContractListUsecaseRequest implements UsecaseRequest {
    constructor (
        public data: FilterConditionsDto
    ) { }
}