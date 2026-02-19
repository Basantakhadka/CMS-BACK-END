// usecase/delete-contract-alert.usecase.ts
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject, NotFoundException } from "@nestjs/common";

import { DeleteContractAlertUsecaseRequest } from "./request/delete-contract-alert.usecase.request";
import { DeleteContractAlertUsecaseResponse } from "./response/delete-contract-alert.usecase.response";
import { ContractAlertsRepository } from "../repositories/alerts.repository";
import { ContractAlertsDbRepository } from "../repositories/db/alerts.repository";

export class DeleteContractAlertUsecase
  implements Usecase<DeleteContractAlertUsecaseRequest, DeleteContractAlertUsecaseResponse>
{
  constructor(
    @Inject(ContractAlertsDbRepository)
    private readonly contractAlertRepository: ContractAlertsRepository
  ) {}

  async execute(
    request: DeleteContractAlertUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<DeleteContractAlertUsecaseResponse>> {

    // 1️⃣ Find the alert
    const alert = await this.contractAlertRepository.findById(request.id);
    if (!alert) {
      throw new NotFoundException(`Contract alert with id ${request.id} not found`);
    }

    // 2️⃣ Soft delete: mark deleted
    alert.deleted = true;
    alert.updated_at = new Date();

    await this.contractAlertRepository.update(alert);

    // 3️⃣ Return response
    const response = new DeleteContractAlertUsecaseResponse(request.id);
    return Result.createSuccessWithMessage(
      response,
      "Contract alert soft-deleted successfully"
    );
  }
}
