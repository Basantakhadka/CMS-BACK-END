// usecase/get-one-contract-alert.usecase.ts
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject, NotFoundException } from "@nestjs/common";


import { GetOneContractAlertUsecaseRequest } from "./request/get-one-contract-alert.usecase.request";
import { GetOneContractAlertUsecaseResponse } from "./response/get-one-contract-alert.usecase.response";
import { ContractAlertsDbRepository } from "../repositories/db/alerts.repository";
import { ContractAlertsRepository } from "../repositories/alerts.repository";

export class GetOneContractAlertUsecase
  implements Usecase<GetOneContractAlertUsecaseRequest, GetOneContractAlertUsecaseResponse>
{
  constructor(
    @Inject(ContractAlertsDbRepository)
    private readonly contractAlertRepository: ContractAlertsRepository
  ) {}

  async execute(
    request: GetOneContractAlertUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<GetOneContractAlertUsecaseResponse>> {

    // 1️⃣ Find alert by ID
    const savedAlert = await this.contractAlertRepository.findById(request.id);

    if (!savedAlert) {
      return Result.createErrorWithMessage(
        new NotFoundException(),
        `Cannot find contract alert with id ${request.id}`
      );
    }

    // 2️⃣ Prepare response object
    const response = new GetOneContractAlertUsecaseResponse({
      id: savedAlert.id,
      contractId: savedAlert?.contract_id,
      triggerExpiry: savedAlert.trigger_expiry,
      enableCustom: savedAlert.enable_custom,
      reminderInterval: savedAlert.reminder_interval,
      communicationChannels: savedAlert.communication_channels,
      stakeholders: savedAlert.stakeholders,
      createdAt: savedAlert.created_at,
      updatedAt: savedAlert.updated_at
    });

    // 3️⃣ Return success result
    return Result.createSuccess(response.data);
  }
}
