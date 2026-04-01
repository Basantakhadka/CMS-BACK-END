import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class RejectContractChangeRequestUsecaseResponse implements UsecaseResponse {
    constructor (
        public readonly requestId: string,
    ) { }
}
