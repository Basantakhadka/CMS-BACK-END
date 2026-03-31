// usecase/add-contract-alert.usecase.ts
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ForbiddenException, Inject } from "@nestjs/common";

import { IdGenerator } from "@app/shared/id-generator";

import { ContractAlertsDbRepository } from "@app/feature/alerts/repositories/db/alerts.repository";
import { AddContractAlertUsecaseRequest } from "@app/feature/alerts/usecase/request/add-contract-alert.usecase.request";
import { AddContractAlertUsecaseResponse } from "@app/feature/alerts/usecase/response/add-contract-alert-.usecase.response";
import { ContractAlertsRepository } from "@app/feature/alerts/repositories/alerts.repository";
import { ContractAlert } from "@app/feature/alerts/entities/alerts.entity";

export class AddContractAlertUsecase
  implements Usecase<AddContractAlertUsecaseRequest, AddContractAlertUsecaseResponse>
{
  constructor(
    @Inject(ContractAlertsDbRepository)
    private readonly contractAlertRepository: ContractAlertsRepository
  ) {}

  async execute(
    request: AddContractAlertUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<AddContractAlertUsecaseResponse>> {
    const clientCode = requestContext?.getCurrentUser()?.clientCode;
    if (!clientCode) {
      throw new ForbiddenException('Missing client context');
    }

    // 1️⃣ Generate alert ID
    const alertId = IdGenerator.generateId("v4");
    console.log({ alertId });

    // 2️⃣ Create ContractAlert entity
    const alert = new ContractAlert();
    alert.id = alertId;
    alert.contract_id = request.contractId;
    alert.trigger_expiry = request.triggerExpiry ?? false;
    alert.enable_custom = request.enableCustom ?? false;
    alert.reminder_interval = request.reminderInterval;
    alert.communication_channels = request.communicationChannels ?? [];
    alert.stakeholders = Array.isArray(request.stakeholders) ? request.stakeholders : [];
    alert.client_code = clientCode;

    // Audit fields
    const loggedInUser = requestContext?.getCurrentUser()?.loginId || "SYSTEM";
    alert.created_at = new Date();
    alert.updated_at = new Date();
    alert.deleted = false;


    // 3️⃣ Save to DB
    await this.contractAlertRepository.insert(alert);

    // 4️⃣ Return response
    const response = new AddContractAlertUsecaseResponse();

    return Result.createSuccessWithMessage(
      response,
      "Contract alert created successfully"
    );
  }
}
