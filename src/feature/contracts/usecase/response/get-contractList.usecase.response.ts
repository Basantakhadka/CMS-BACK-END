import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { GetContractListResponseDto } from "../../dtos/contractList.dtos";

export class GetContractListUsecaseResponse implements UsecaseResponse {
    constructor (
        public list: GetContractListResponseDto[],
        public pageInfo: PageInfoDto
    ) { }
}