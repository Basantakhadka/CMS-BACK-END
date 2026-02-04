import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class DeleteContractAlertUsecaseResponse implements UsecaseResponse {
    constructor (
        public id: string
    ) { }
}