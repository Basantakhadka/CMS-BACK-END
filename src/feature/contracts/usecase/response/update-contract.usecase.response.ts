import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class UpdateContractUsecaseResponse implements UsecaseResponse {
    constructor (
        public readonly requestId: string,
        public readonly contractId: string,
    ) { }
}