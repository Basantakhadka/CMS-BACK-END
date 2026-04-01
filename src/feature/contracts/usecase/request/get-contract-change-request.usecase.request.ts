import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class GetContractChangeRequestDetailsUsecaseRequest implements UsecaseRequest {
    constructor (
        public readonly id: string,
    ) { }
}
