import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { Client } from "@app/feature/identity-access/entities/client.entity";

export class GetClientsUsecaseResponse implements UsecaseResponse {
    constructor (public readonly clients: Client[]) { }
}
