import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";
import { FilterConditionsDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";

export class GetRoleUsecaseRequest implements UsecaseRequest{
    constructor(
        public data:FilterConditionsDto
    ){}
}