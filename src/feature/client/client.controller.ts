// client.controller.ts
import {
  Body,
  Controller,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";
import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { GetClientListUsecaseRequest } from "./usecase/request/get-client-list.usecase.request";
import { GetClientListUsecase } from "./usecase/get-client-list.usecase";

@ApiTags("clients")
@Controller("clients")
export class ClientController {
  constructor(
    private readonly getClientListUsecase: GetClientListUsecase,
    private readonly als: AsyncLocalStorage<RequestContext>,
  ) { }

  @Post("/list")
  async getClients(@Body() body: FilterConditionsDto) {
    const filterConditions: FilterConditionsDto = body;
    const request = new GetClientListUsecaseRequest(filterConditions);
    return await this.getClientListUsecase.execute(request);
  }
}
