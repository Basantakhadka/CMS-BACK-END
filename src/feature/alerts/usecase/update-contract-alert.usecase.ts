// usecase/update-contract-alert.usecase.ts
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject, NotFoundException } from "@nestjs/common";
import { UpdateContractAlertUsecaseRequest } from "./request/update-contract-alert.usecase.request";
import { UpdateContractAlertUsecaseResponse } from "./response/update-contract-alert.usecase.response";
import { ContractAlertsDbRepository } from "../repositories/db/alerts.repository";
import { ContractAlertsRepository } from "../repositories/alerts.repository";

export class UpdateContractAlertUsecase
  implements Usecase<UpdateContractAlertUsecaseRequest, UpdateContractAlertUsecaseResponse>
{
  constructor(
    @Inject(ContractAlertsDbRepository)
    private readonly contractAlertRepository: ContractAlertsRepository
  ) {}

  async execute(
    request: UpdateContractAlertUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<UpdateContractAlertUsecaseResponse>> {

    // 1️⃣ Find existing alert by ID
    const existingAlert = await this.contractAlertRepository.findById(request.id);

    if (!existingAlert) {
      throw new NotFoundException(`Contract alert with id ${request.id} not found`);
    }

    // 2️⃣ Update only fields provided in request (partial update)
    existingAlert.trigger_expiry = request.triggerExpiry ?? existingAlert.trigger_expiry;
    existingAlert.enable_custom = request.enableCustom ?? existingAlert.enable_custom;
    existingAlert.reminder_interval = request.reminderInterval ?? existingAlert.reminder_interval;
    existingAlert.communication_channels = request.communicationChannels ?? existingAlert.communication_channels;
    existingAlert.stakeholders = (
      request.stakeholders
        ? Array.isArray(request.stakeholders)
          ? request.stakeholders
          : [request.stakeholders]
        : existingAlert.stakeholders
    );
    existingAlert.deleted = request.deleted ?? existingAlert.deleted;

    // Audit field
    const loggedInUser = requestContext?.getCurrentUser()?.loginId || "SYSTEM";
    existingAlert.updated_at = new Date();

    // 3️⃣ Save updated alert
    await this.contractAlertRepository.update(existingAlert);

    // 4️⃣ Return response
    const response = new UpdateContractAlertUsecaseResponse(
    );

    return Result.createSuccessWithMessage(
      response,
      "Contract alert updated successfully"
    );
  }
}
