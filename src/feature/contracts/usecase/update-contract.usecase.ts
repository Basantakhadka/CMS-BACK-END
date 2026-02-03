import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject, NotFoundException } from "@nestjs/common";

import { ContractRepository } from "../repositories/contract.repository";
import { UpdateContractUsecaseRequest } from "./request/update-contract.usecase.request";
import { UpdateContractUsecaseResponse } from "./response/update-contract.usecase.response";
import { ContractDbRepository } from "../repositories/db/contact.respository";

export class UpdateContractUsecase
  implements Usecase<UpdateContractUsecaseRequest, UpdateContractUsecaseResponse>
{
  constructor(
    @Inject(ContractDbRepository)
    private readonly contractRepository: ContractRepository
  ) {}

  async execute(
    request: UpdateContractUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<UpdateContractUsecaseResponse>> {

    // 1️⃣ Find existing contract by ID
    const existingContract = await this.contractRepository.findById(request.id);

    if (!existingContract) {
      throw new NotFoundException(`Contract with id ${request.id} not found`);
    }

    // 2️⃣ Update only fields provided in request (partial update)
    existingContract.contract_title = request.title ?? existingContract.contract_title;
    existingContract.contract_type = request.type ?? existingContract.contract_type;
    existingContract.parties = request.parties ?? existingContract.parties;
    existingContract.expiry_date = request.expiryDate;
    existingContract.document_link = request.documentLink ?? existingContract.document_link;
    existingContract.contract_value = request.contractValue ?? existingContract.contract_value;
    existingContract.jurisdiction = request.jurisdiction ?? existingContract.jurisdiction;
    existingContract.renewal_terms = request.renewalTerms ?? existingContract.renewal_terms;
    existingContract.governing_law = request.governingLaw ?? existingContract.governing_law;

    // Audit fields
    const loggedInUser = requestContext?.getCurrentUser()?.loginId || "SYSTEM";
    existingContract.updated_at = new Date();

    // 3️⃣ Save updated contract
    await this.contractRepository.update(existingContract);

    // 4️⃣ Return response
    const response = new UpdateContractUsecaseResponse();

    return Result.createSuccessWithMessage(
      response,
      "Contract updated successfully"
    );
  }
}
