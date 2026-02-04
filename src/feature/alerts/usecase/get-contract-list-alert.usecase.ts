// usecase/get-contract-alert-list.usecase.ts
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { DateTimePatternType } from "@app/shared/constants/datetime-format.constants";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { Inject, NotFoundException } from "@nestjs/common";


import { DateUtils } from "@app/shared/utils/date-utils";

import { GetContractAlertListUsecaseRequest } from "./request/get-contract-alert-list.usecase.request";
import { GetContractAlertListUsecaseResponse } from "./response/get-contract-alert-list.usecase.response";
import { ContractAlertsDbRepository } from "../repositories/db/alerts.repository";
import { ContractAlertsRepository } from "../repositories/alerts.repository";
import { GetContractAlertResponseDto } from "../dtos/alerts-list.dtos";


export class GetContractAlertsListUsecase
  implements Usecase<GetContractAlertListUsecaseRequest, GetContractAlertListUsecaseResponse>
{
  constructor(
    @Inject(ContractAlertsDbRepository)
    private readonly contractAlertRepository: ContractAlertsRepository
  ) {}

  async execute(
    request: GetContractAlertListUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<GetContractAlertListUsecaseResponse>> {

    // 1️⃣ Get paginated contract alerts
    const alertsList = await this.contractAlertRepository.findAllAndResponseWithPagination(
     request.data,
      request.data.pageInfo
    );

    if (!alertsList || alertsList.getElements().length === 0) {
      return Result.createErrorWithMessage(
        new NotFoundException(),
        "No contract alerts found"
      );
    }

    // 2️⃣ Map alerts to response DTO
    const alertsResponse: GetContractAlertResponseDto[] = [];
    const elements = alertsList.getElements();

    elements.forEach((alert) => {
      const dto = new GetContractAlertResponseDto();
      dto.id = alert.id;
      dto.contractId = alert.contract_id;
      dto.triggerExpiry = alert.trigger_expiry;
      dto.enableCustom = alert.enable_custom;
      dto.reminderInterval = alert.reminder_interval;
      dto.communicationChannels = alert.communication_channels;
      dto.stakeholders = alert.stakeholders;
      dto.createdAt = alert.created_at
        ? DateUtils.formatDateTime(
            alert.created_at,
            DateTimePatternType.MMM_DD_YYYY_HMS.displayname
          )
        : null;
      dto.updatedAt = alert.updated_at
        ? DateUtils.formatDateTime(
            alert.updated_at,
            DateTimePatternType.MMM_DD_YYYY_HMS.displayname
          )
        : null;

      alertsResponse.push(dto);
    });

    // 3️⃣ Prepare pagination info
    const pageInfo = new PageInfoDto();
    pageInfo.current = alertsList.getCurrentPage();
    pageInfo.size = alertsList.getSize();

    // 4️⃣ Return response
    const response = new GetContractAlertListUsecaseResponse(alertsResponse, pageInfo);
    return Result.createSuccess(response);
  }
}
