import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { PageInfoDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { GetUserListResponseDto } from "../../dtos/get-user-list-response.dto";

export class GetUsersListUsecaseResponse implements UsecaseResponse{
    constructor(
        public list: GetUserListResponseDto[],
        public pageInfo: PageInfoDto
    ){}
}