import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class DeleteUserUsecaseRequest implements UsecaseRequest {
    constructor (
        public id: string
    ) { }
}