import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class DeleteContractUsecaseRequest implements UsecaseRequest {
    constructor (
        public id: string
    ) { }
}