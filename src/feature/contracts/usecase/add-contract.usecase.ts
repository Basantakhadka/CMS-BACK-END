import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject } from "@nestjs/common";

import { IdGenerator } from "@app/shared/id-generator";
import { ContractRepository } from "../repositories/contract.repository";
import { AddContractUsecaseRequest } from "./request/add-contract.usecase.request";
import { AddContractUsecaseResponse } from "./response/add-contract.usecase.response";
import { Contract } from "../entities/contracts.entity";
import { ContractDbRepository } from "../repositories/db/contact.respository";

export class AddContractUsecase
  implements Usecase<AddContractUsecaseRequest, AddContractUsecaseResponse> 
{
  constructor(
    @Inject(ContractDbRepository)
    private readonly contractRepository: ContractRepository
  ) {}

  async execute(
    request: AddContractUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<AddContractUsecaseResponse>> {

    // 1️⃣ Generate contract ID
    const contractId = IdGenerator.generateId("v4");
    console.log({contractId})

    // 2️⃣ Create Contract entity
    const contract = new Contract();
    contract.id = contractId;
    contract.contract_title = request.title;
    contract.contract_type = request.type;
    contract.parties = request.parties;
    contract.expiry_date = request.expiryDate;
    contract.document_link = request.documentLink;
    contract.contract_value = request.contractValue;
    contract.jurisdiction = request.jurisdiction;
    contract.renewal_terms = request.renewalTerms;
    contract.governing_law = request.governingLaw;

    console.log({contract})

    // Audit fields
    const loggedInUser = requestContext?.getCurrentUser()?.loginId || "SYSTEM";
    contract.created_at = new Date();
    contract.updated_at = new Date();

    // 3️⃣ Save to DB
    await this.contractRepository.insert(contract);

    // 4️⃣ Return response
    const response = new AddContractUsecaseResponse();

    return Result.createSuccessWithMessage(
      response,
      "Contract created successfully"
    );
  }
}
