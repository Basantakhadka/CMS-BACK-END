import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ForbiddenException, Inject } from "@nestjs/common";

import { IdGenerator } from "@app/shared/id-generator";
import { AddContractUsecaseRequest } from "./request/add-contract.usecase.request";
import { AddContractUsecaseResponse } from "./response/add-contract.usecase.response";
import { ContractChangeRequest } from "../entities/contract-change-request.entity";
import { ContractChangeRequestStatus, ContractChangeRequestType } from "../constants/change-request.constants";
import { ContractChangeRequestDbRepository } from "../repositories/db/contract-change-request.db.repository";
import { ContractChangeRequestRepository } from "../repositories/contract-change-request.repository";
import { buildCreateSnapshot } from "../utils/contract-change-request.util";

export class AddContractUsecase
  implements Usecase<AddContractUsecaseRequest, AddContractUsecaseResponse> 
{
  constructor(
    @Inject(ContractChangeRequestDbRepository)
    private readonly changeRequestRepository: ContractChangeRequestRepository,
  ) {}

  async execute(
    request: AddContractUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<AddContractUsecaseResponse>> {

    const clientCode = requestContext?.getCurrentUser()?.clientCode;
    if (!clientCode) {
      throw new ForbiddenException('Missing client context');
    }

    const snapshot = buildCreateSnapshot(request, clientCode);
    const changeRequest = new ContractChangeRequest();
    changeRequest.id = IdGenerator.generateId("v4");
    changeRequest.contract_id =IdGenerator.generateId("v4");
    changeRequest.change_type = ContractChangeRequestType.CREATE;
    changeRequest.status = ContractChangeRequestStatus.PENDING;
    changeRequest.requested_by = requestContext?.getCurrentUser()?.userId || "SYSTEM";
    changeRequest.requested_at = new Date();
    changeRequest.new_data = snapshot;
    changeRequest.client_code = clientCode;

    await this.changeRequestRepository.insert(changeRequest);

    const response = new AddContractUsecaseResponse(changeRequest.id);

    return Result.createSuccessWithMessage(
      response,
      "Contract change request submitted for approval"
    );
  }
}
