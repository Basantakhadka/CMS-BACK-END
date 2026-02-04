// contract-alerts.controller.ts
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";
import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { CreateContractAlertDto } from "./dtos/create-alerts.dtos";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { UpdateContractAlertDto } from "./dtos/update-alerts.dtos";
import { AddContractAlertUsecaseRequest } from "./usecase/request/add-contract-alert.usecase.request";
import { AddContractAlertUsecase } from "./usecase/add-contract-alert.usecase";
import { UpdateContractAlertUsecase } from "./usecase/update-contract-alert.usecase";
import { DeleteContractAlertUsecase } from "./usecase/delete-contract-alert.usecase";
import { GetContractAlertsListUsecase } from "./usecase/get-contract-list-alert.usecase";
import { GetOneContractAlertUsecase } from "./usecase/get-one-contract-alert.usecase";
import { GetContractAlertListUsecaseRequest } from "./usecase/request/get-contract-alert-list.usecase.request";
import { GetOneContractAlertUsecaseRequest } from "./usecase/request/get-one-contract-alert.usecase.request";
import { UpdateContractAlertUsecaseRequest } from "./usecase/request/update-contract-alert.usecase.request";
import { DeleteContractAlertUsecaseRequest } from "./usecase/request/delete-contract-alert.usecase.request";

@ApiTags("Contract Alerts")
@Controller("contract-alerts")
@UseInterceptors(PermissionInterceptor)
export class ContractAlertsController {
    constructor(
        private readonly addContractAlertUsecase: AddContractAlertUsecase,
        private readonly updateContractAlertUsecase: UpdateContractAlertUsecase,
        private readonly deleteContractAlertUsecase: DeleteContractAlertUsecase,
        private readonly getContractAlertsListUsecase: GetContractAlertsListUsecase,
        private readonly getOneContractAlertUsecase: GetOneContractAlertUsecase,
        private readonly als: AsyncLocalStorage<RequestContext>,
    ) {}

    @Post("/add")
    async saveAlert(@Body() body: CreateContractAlertDto) {
        const createAlert: CreateContractAlertDto = body;

        const request = new AddContractAlertUsecaseRequest(
            createAlert.contractId,
            createAlert.triggerExpiry,
            createAlert.enableCustom,
            createAlert.reminderInterval,
            createAlert.communicationChannels,
            createAlert.stakeholders,
        );

        return await this.addContractAlertUsecase.execute(request, this.als.getStore());
    }

    @Post("/list")
    async getAlerts(@Body() body: FilterConditionsDto) {
        const filterConditions: FilterConditionsDto = body;
        const request = new GetContractAlertListUsecaseRequest(filterConditions);
        return await this.getContractAlertsListUsecase.execute(request);
    }

    @Get("/:id")
    async getOneAlert(@Param("id") id: string) {
        const request = new GetOneContractAlertUsecaseRequest(id);
        return await this.getOneContractAlertUsecase.execute(request);
    }

    @Put("/:id")
    async updateAlert(@Param("id") id: string, @Body() body: UpdateContractAlertDto) {
        const updateAlert: UpdateContractAlertDto = body;

        const request = new UpdateContractAlertUsecaseRequest(
            id,
            updateAlert.triggerExpiry,
            updateAlert.enableCustom,
            updateAlert.reminderInterval,
            updateAlert.communicationChannels,
            updateAlert.stakeholders,
            updateAlert.deleted,
        );

        return await this.updateContractAlertUsecase.execute(request, this.als.getStore());
    }

    @Delete("/:id")
    async deleteAlert(@Param("id") id: string) {
        const request = new DeleteContractAlertUsecaseRequest(id);
        return await this.deleteContractAlertUsecase.execute(request, this.als.getStore());
    }

}
