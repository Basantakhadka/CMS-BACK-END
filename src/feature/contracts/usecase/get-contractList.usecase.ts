import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { DateTimePatternType } from "@app/shared/constants/datetime-format.constants";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { Inject, NotFoundException } from "@nestjs/common";

import { ContractDbRepository } from "../repositories/db/contact.respository";
import { ContractRepository } from "../repositories/contract.repository";
import { DateUtils } from "@app/shared/utils/date-utils";
import { GetContractListUsecaseRequest } from "./request/get-contractList.usecase.request";
import { GetContractListUsecaseResponse } from "./response/get-contractList.usecase.response";
import { GetContractListResponseDto } from "../dtos/contractList.dtos";

export class GetContractsListUsecase
  implements Usecase<GetContractListUsecaseRequest, GetContractListUsecaseResponse>
{
  constructor(
    @Inject(ContractDbRepository)
    private readonly contractRepository: ContractRepository
  ) {}

  async execute(
    request: GetContractListUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<GetContractListUsecaseResponse>> {

    // 1️⃣ Get paginated contracts
    const contractsList = await this.contractRepository.findAllAndResponseWithPagination(
      request.data,
      request.data.pageInfo
    );

    if (!contractsList || contractsList.getElements().length === 0) {
      return Result.createErrorWithMessage(
        new NotFoundException(),
        "No contracts found"
      );
    }

    // 2️⃣ Map contracts to response DTO
    const contractsResponse: GetContractListResponseDto[] = [];
    const elements = contractsList.getElements();

    elements.forEach((contract) => {
      const dto = new GetContractListResponseDto();
      dto.id = contract.id;
      dto.title = contract.contract_title;
      dto.type = contract.contract_type;
      dto.parties = contract.parties; // JSONB array
      dto.expiryDate = contract.expiry_date
        ? DateUtils.formatDateTime(
            contract.expiry_date,
            DateTimePatternType.MMM_DD_YYYY_HMS.displayname
          )
        : null;
        dto.contractDate = contract.contract_date
        ? DateUtils.formatDateTime(
            contract.contract_date,
            DateTimePatternType.MMM_DD_YYYY_HMS.displayname
          )
        : null;
      dto.documentLink = contract.document_link;
      dto.contractValue = contract.contract_value;
      dto.jurisdiction = contract.jurisdiction;
      dto.renewalTerms = contract.renewal_terms;
      dto.governingLaw = contract.governing_law;
      dto.scopeOfWork = contract.scope_of_work;
      dto.amendmentDate = contract.amendment_date
        ? DateUtils.formatDateTime(
            contract.amendment_date,
            DateTimePatternType.MMM_DD_YYYY_HMS.displayname
          )
        : null;
      dto.amendmentLink = contract.amendment_link;
      dto.terminationNoticeDays = contract.termination_notice_days;
      dto.createdAt = contract.created_at
        ? DateUtils.formatDateTime(
            contract.created_at,
            DateTimePatternType.MMM_DD_YYYY_HMS.displayname
          )
        : null;
      dto.updatedAt = contract.updated_at
        ? DateUtils.formatDateTime(
            contract.updated_at,
            DateTimePatternType.MMM_DD_YYYY_HMS.displayname
          )
        : null;

      contractsResponse.push(dto);
    });

    // 3️⃣ Prepare pagination info
    const pageInfo = new PageInfoDto();
    pageInfo.current = contractsList.getCurrentPage();
    pageInfo.size = contractsList.getSize();

    // 4️⃣ Return response
    const response = new GetContractListUsecaseResponse(contractsResponse, pageInfo);
    return Result.createSuccess(response);
  }
}
