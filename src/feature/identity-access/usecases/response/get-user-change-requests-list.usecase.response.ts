import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { PageInfoDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { GetUserChangeRequestListResponseDto } from "../../dtos/get-user-change-request-list-response.dto";

export class GetUserChangeRequestsListUsecaseResponse implements UsecaseResponse{
    constructor(
        public list: GetUserChangeRequestListResponseDto[],
        public pageInfo: PageInfoDto
    ){}
}