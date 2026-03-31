import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { RequestContext } from "@app/core/middleware/request_context";
import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { ApiTags } from "@nestjs/swagger";
import { CreateClientDto } from "./dtos/create-client.dto";
import { AddClientUsecase } from "./usecase/add-client.usecase";
import { AddClientUsecaseRequest } from "./usecase/request/add-client.usecase.request";
import { GetClientsUsecase } from "./usecase/get-clients.usecase";
import { GetClientsUsecaseRequest } from "./usecase/request/get-clients.usecase.request";

@ApiTags('Identity Access | Clients')
@Controller('identity-access/clients')
@UseInterceptors(PermissionInterceptor)
export class ClientsController {
    constructor (
        private readonly addClientUsecase: AddClientUsecase,
        private readonly getClientsUsecase: GetClientsUsecase,
        private readonly als: AsyncLocalStorage<RequestContext>,
    ) { }

    @Post()
    async createClient(@Body() body: CreateClientDto) {
        const request = new AddClientUsecaseRequest(
            body.clientCode,
            body.clientName,
        );
        return this.addClientUsecase.execute(request, this.als.getStore());
    }

    @Get()
    async getClients() {
        const request = new GetClientsUsecaseRequest(true);
        return this.getClientsUsecase.execute(request);
    }
}
