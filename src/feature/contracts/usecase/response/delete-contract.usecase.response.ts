import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class DeleteContractUsecaseResponse implements UsecaseResponse {
    constructor (
        public id: string
    ) { }
}