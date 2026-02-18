import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject, NotFoundException } from "@nestjs/common";

import { Contract } from "../entities/contracts.entity";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractDbRepository } from "../repositories/db/contact.respository";

import { DeleteContractUsecaseRequest } from "./request/delete-contract.usecase.request";
import { DeleteContractUsecaseResponse } from "./response/delete-contract.usecase.response";

export class DeleteContractUsecase
  implements Usecase<DeleteContractUsecaseRequest, DeleteContractUsecaseResponse>
{
  constructor(
      @Inject(ContractDbRepository)
    private readonly contractRepository: ContractRepository
  ) {}

  async execute(
    request: DeleteContractUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<DeleteContractUsecaseResponse>> {

    // 1️⃣ Find the contract
    const contract = await this.contractRepository.findById(request.id);
    if (!contract) {
      throw new NotFoundException(`Contract with id ${request.id} not found`);
    }

    // 2️⃣ Soft delete: mark deleted
    contract.deleted = true; // Make sure your Contract entity has `deleted` boolean column
    contract.updated_at = new Date();

    await this.contractRepository.update(contract);

    // 3️⃣ Optionally, perform additional cleanup if needed (like audit)

    // 4️⃣ Return response
    const response = new DeleteContractUsecaseResponse(request.id);
    return Result.createSuccessWithMessage(
      response,
      "Contract soft-deleted successfully"
    );
  }
}
