import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { GetContractListResponseDto } from "@app/feature/contracts/dtos/contractList.dtos";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { GetContractAlertResponseDto } from "../../dtos/alerts-list.dtos";


export class GetContractAlertListUsecaseResponse implements UsecaseResponse {
    constructor (
        public list: GetContractAlertResponseDto[],
        public pageInfo: PageInfoDto
    ) { }
}