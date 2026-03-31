import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class AddClientUsecaseResponse implements UsecaseResponse {
    constructor (
        public readonly clientCode: string,
    ) { }
}
