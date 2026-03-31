import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class GetClientsUsecaseRequest implements UsecaseRequest {
    constructor (public readonly activeOnly: boolean = true) { }
}
