import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class DeleteUserUsecaseResponse implements UsecaseResponse {
    constructor (
        public id: string
    ) { }
}