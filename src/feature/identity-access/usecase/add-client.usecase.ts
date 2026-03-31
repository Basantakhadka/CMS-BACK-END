import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Client } from "@app/feature/identity-access/entities/client.entity";
import {
    ConflictException,
    Inject,
} from "@nestjs/common";
import { ClientDbRepository } from "../repositories/db/client.repository";
import { ClientRepository } from "../repositories/client.repository";
import { AddClientUsecaseRequest } from "./request/add-client.usecase.request";
import { AddClientUsecaseResponse } from "./response/add-client.usecase.response";

export class AddClientUsecase
    implements Usecase<AddClientUsecaseRequest, AddClientUsecaseResponse> {
    constructor (
        @Inject(ClientDbRepository)
        private readonly clientRepository: ClientRepository,
    ) { }

    async execute(
        request: AddClientUsecaseRequest,
        _requestContext?: RequestContext,
    ): Promise<Result<AddClientUsecaseResponse>> {

        const existingClient = await this.clientRepository.findByCode(request.clientCode);
        if (existingClient) {
            throw new ConflictException(
                `Client with code ${ request.clientCode } already exists`,
            );
        }

        const entity = new Client();
        entity.clientCode = request.clientCode.trim();
        entity.clientName = request.clientName.trim();

        const persisted = await this.clientRepository.insert(entity);

        return Result.createSuccessWithMessage(
            new AddClientUsecaseResponse(persisted.clientCode),
            'Client created successfully',
        );
    }
}
