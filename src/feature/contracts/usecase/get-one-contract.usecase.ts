import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractDbRepository } from "../repositories/db/contact.respository";
import { GetOneContractUsecaseRequest } from "./request/get-one-contract.usecase.request";
import { GetOneContractUsecaseResponse } from "./response/get-one-contract.usecase.response";

export class GetOneContractUsecase
  implements Usecase<GetOneContractUsecaseRequest, GetOneContractUsecaseResponse>
{
  constructor(
    @Inject(ContractDbRepository)
    private readonly contractRepository: ContractRepository
  ) {}

  async execute(
    request: GetOneContractUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<GetOneContractUsecaseResponse>> {
    const clientCode = requestContext?.getCurrentUser()?.clientCode;
    if (!clientCode) {
      throw new ForbiddenException('Missing client context');
    }

    const savedContract = await this.contractRepository.findById(request.id);

    if (!savedContract || savedContract.client_code !== clientCode) {
      return Result.createErrorWithMessage(
        new NotFoundException(),
        `Cannot find contract with id ${request.id}`
      );
    }

    // 2️⃣ Prepare response object (optional: map any fields if needed)
    const response = new GetOneContractUsecaseResponse({
      id: savedContract.id,
      title: savedContract.contract_title,
      type: savedContract.contract_type,
      parties: savedContract.parties,
      expiryDate: savedContract.expiry_date,
      contractDate: savedContract.contract_date,
      documentLink: savedContract.document_link,
      contractValue: savedContract.contract_value,
      jurisdiction: savedContract.jurisdiction,
      renewalTerms: savedContract.renewal_terms,
      governingLaw: savedContract.governing_law,
      createdAt: savedContract.created_at,
      updatedAt: savedContract.updated_at,
      scopeOfWork: savedContract.scope_of_work,
      amendmentDate: savedContract.amendment_date,
      amendmentLink: savedContract.amendment_link,
      terminationNoticeDays: savedContract.termination_notice_days
    });

    // 3️⃣ Return success result
    return Result.createSuccess(response.data);
  }
}
