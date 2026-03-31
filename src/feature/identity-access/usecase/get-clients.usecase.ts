import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject } from "@nestjs/common";
import { ClientDbRepository } from "../repositories/db/client.repository";
import { ClientRepository } from "../repositories/client.repository";
import { GetClientsUsecaseRequest } from "./request/get-clients.usecase.request";
import { GetClientsUsecaseResponse } from "./response/get-clients.usecase.response";

export class GetClientsUsecase
    implements Usecase<GetClientsUsecaseRequest, GetClientsUsecaseResponse> {
    constructor (
        @Inject(ClientDbRepository)
        private readonly clientRepository: ClientRepository,
    ) { }

    async execute(
        request: GetClientsUsecaseRequest = new GetClientsUsecaseRequest(),
    ): Promise<Result<GetClientsUsecaseResponse>> {
        // const shouldReturnActiveOnly = request.activeOnly ?? true;
        const clients =  await this.clientRepository.findAll();

        return Result.createSuccess(new GetClientsUsecaseResponse(clients));
    }
}
