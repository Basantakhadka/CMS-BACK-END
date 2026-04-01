import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class ApproveContractChangeRequestUsecaseResponse implements UsecaseResponse {
    constructor (
        public readonly requestId: string,
        public readonly contractId: string,
    ) { }
}
