import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class AddContractUsecaseResponse implements UsecaseResponse {
    constructor (public readonly requestId: string) { }
}