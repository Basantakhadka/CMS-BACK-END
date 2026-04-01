import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";

import { ContractRepository } from "../repositories/contract.repository";
import { UpdateContractUsecaseRequest } from "./request/update-contract.usecase.request";
import { UpdateContractUsecaseResponse } from "./response/update-contract.usecase.response";
import { ContractDbRepository } from "../repositories/db/contact.respository";
import { ContractChangeRequestDbRepository } from "../repositories/db/contract-change-request.db.repository";
import { ContractChangeRequestRepository } from "../repositories/contract-change-request.repository";
import { ContractChangeRequest } from "../entities/contract-change-request.entity";
import { ContractChangeRequestStatus, ContractChangeRequestType } from "../constants/change-request.constants";
import { buildUpdateSnapshot, sanitizeContractEntity } from "../utils/contract-change-request.util";
import { IdGenerator } from "@app/shared/id-generator";

export class UpdateContractUsecase
  implements Usecase<UpdateContractUsecaseRequest, UpdateContractUsecaseResponse>
{
  constructor(
    @Inject(ContractDbRepository)
    private readonly contractRepository: ContractRepository,
    @Inject(ContractChangeRequestDbRepository)
    private readonly changeRequestRepository: ContractChangeRequestRepository,
  ) {}

  async execute(
    request: UpdateContractUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<UpdateContractUsecaseResponse>> {

    const clientCode = requestContext?.getCurrentUser()?.clientCode;
    if (!clientCode) {
      throw new ForbiddenException('Missing client context');
    }

    // 1️⃣ Find existing contract by ID
    const existingContract = await this.contractRepository.findById(request.id);

    if (!existingContract || existingContract.client_code !== clientCode) {
      throw new NotFoundException(`Contract with id ${request.id} not found`);
    }

    const snapshot = buildUpdateSnapshot(request, existingContract, clientCode);
    const oldData = sanitizeContractEntity(existingContract);

    const changeRequest = new ContractChangeRequest();
    changeRequest.id = IdGenerator.generateId("v4");
    changeRequest.contract_id = existingContract.id;
    changeRequest.change_type = ContractChangeRequestType.UPDATE;
    changeRequest.status = ContractChangeRequestStatus.PENDING;
    changeRequest.requested_by = requestContext?.getCurrentUser()?.loginId || "SYSTEM";
    changeRequest.requested_at = new Date();
    changeRequest.old_data = oldData ?? undefined;
    changeRequest.new_data = snapshot;
    changeRequest.client_code = clientCode;

    await this.changeRequestRepository.insert(changeRequest);

    const response = new UpdateContractUsecaseResponse(changeRequest.id, existingContract.id);

    return Result.createSuccessWithMessage(
      response,
      "Contract change request submitted for approval"
    );
  }
}
