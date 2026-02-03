import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { Contract } from "../../entities/contracts.entity";
import { GetContractListResponseDto } from "../../dtos/contractList.dtos";

export class GetOneContractUsecaseResponse implements UsecaseResponse{
    constructor(public data: GetContractListResponseDto){}
}