import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { GetUserListResponseDto } from "../../dtos/get-user-list-response.dto";

export class GetUsersListUsecaseResponse implements UsecaseResponse {
    constructor (
        public list: GetUserListResponseDto[],
        public pageInfo: PageInfoDto
    ) { }
}