import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class ApproveContractChangeRequestUsecaseRequest implements UsecaseRequest {
    constructor (
        public readonly id: string,
        public readonly remarks?: string,
    ) { }
}
