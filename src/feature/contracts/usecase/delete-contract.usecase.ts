import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";

import { ContractRepository } from "../repositories/contract.repository";
import { ContractDbRepository } from "../repositories/db/contact.respository";

import { DeleteContractUsecaseRequest } from "./request/delete-contract.usecase.request";
import { DeleteContractUsecaseResponse } from "./response/delete-contract.usecase.response";
import { ContractChangeRequestDbRepository } from "../repositories/db/contract-change-request.db.repository";
import { ContractChangeRequestRepository } from "../repositories/contract-change-request.repository";
import { ContractChangeRequest } from "../entities/contract-change-request.entity";
import { ContractChangeRequestStatus, ContractChangeRequestType } from "../constants/change-request.constants";
import { sanitizeContractEntity } from "../utils/contract-change-request.util";
import { IdGenerator } from "@app/shared/id-generator";

export class DeleteContractUsecase
  implements Usecase<DeleteContractUsecaseRequest, DeleteContractUsecaseResponse>
{
  constructor(
      @Inject(ContractDbRepository)
    private readonly contractRepository: ContractRepository,
    @Inject(ContractChangeRequestDbRepository)
    private readonly changeRequestRepository: ContractChangeRequestRepository,
  ) {}

  async execute(
    request: DeleteContractUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<DeleteContractUsecaseResponse>> {
    const clientCode = requestContext?.getCurrentUser()?.clientCode;
    if (!clientCode) {
      throw new ForbiddenException('Missing client context');
    }
     //check if contract exists in change request

     const isChangeRequestExists = await this.changeRequestRepository.findByContractId(request.id);
    if (isChangeRequestExists && isChangeRequestExists.length > 0) {
      throw new ForbiddenException('A change request for this contract already exists.');
    }

    // 1️⃣ Find the contract
    const contract = await this.contractRepository.findById(request.id);
    if (!contract || contract.client_code !== clientCode) {
      throw new NotFoundException(`Contract with id ${request.id} not found`);
    }

    const oldData = sanitizeContractEntity(contract);
    const snapshot = oldData ?? { id: contract.id, client_code: clientCode, deleted: contract.deleted };
    const changeRequest = new ContractChangeRequest();
    changeRequest.id = IdGenerator.generateId("v4");
    changeRequest.contract_id = contract.id;
    changeRequest.change_type = ContractChangeRequestType.DELETE;
    changeRequest.status = ContractChangeRequestStatus.PENDING;
    changeRequest.requested_by = requestContext?.getCurrentUser()?.userId || "SYSTEM";
    changeRequest.requested_at = new Date();
    changeRequest.old_data = oldData ?? undefined;
    changeRequest.new_data = { ...snapshot, deleted: true };
    changeRequest.client_code = clientCode;

    await this.changeRequestRepository.insert(changeRequest);

    const response = new DeleteContractUsecaseResponse(contract.id, changeRequest.id);
    return Result.createSuccessWithMessage(
      response,
      "Contract delete request submitted for approval"
    );
  }
}
