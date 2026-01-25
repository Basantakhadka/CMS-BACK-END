import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class UpdateUserUsecaseResponse implements UsecaseResponse {
    constructor (
        public id: string,
    ) { }
}