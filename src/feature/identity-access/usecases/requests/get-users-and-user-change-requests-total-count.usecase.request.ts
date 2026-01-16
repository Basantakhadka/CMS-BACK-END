import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";
import { FiltersObjectsDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";

export class GetUsersAndUserChangeRequestsTotalCountUsecaseRequest implements UsecaseRequest{
    constructor(
        public filter: FiltersObjectsDto[]
    ){}
}