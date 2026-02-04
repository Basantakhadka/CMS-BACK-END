import { UsecaseResponse } from "@app/core/usecase/usecase.response";

import { GetContractAlertResponseDto } from "../../dtos/alerts-list.dtos";

export class GetOneContractAlertUsecaseResponse implements UsecaseResponse{
    constructor(public data: GetContractAlertResponseDto){}
}