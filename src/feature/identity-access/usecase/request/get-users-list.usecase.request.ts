
import { UsecaseRequest } from "@app/core/usecase/usecase.request";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";

export class GetUsersListUsecaseRequest implements UsecaseRequest {
    constructor (
        public data: FilterConditionsDto
    ) { }
}