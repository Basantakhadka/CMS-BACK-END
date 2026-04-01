import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class RejectContractChangeRequestUsecaseRequest implements UsecaseRequest {
    constructor (
        public readonly id: string,
        public readonly remarks: string,
    ) { }
}
