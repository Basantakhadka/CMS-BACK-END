import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { ContractChangeRequestDetailDto } from "@app/feature/contracts/dtos/contract-change-request-detail.dto";

export class GetContractChangeRequestDetailsUsecaseResponse implements UsecaseResponse {
    constructor (
        public readonly request: ContractChangeRequestDetailDto,
    ) { }
}
