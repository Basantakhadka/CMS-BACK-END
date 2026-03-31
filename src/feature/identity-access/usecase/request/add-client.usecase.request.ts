import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class AddClientUsecaseRequest implements UsecaseRequest {
    constructor (
        public readonly clientCode: string,
        public readonly clientName: string,
    ) { }
}
