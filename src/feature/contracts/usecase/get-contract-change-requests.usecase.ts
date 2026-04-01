import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ContractChangeRequestDbRepository } from "../repositories/db/contract-change-request.db.repository";
import { ContractChangeRequestRepository } from "../repositories/contract-change-request.repository";
import { Inject } from "@nestjs/common";
import { GetContractChangeRequestListUsecaseRequest } from "./request/get-contract-change-requests.usecase.request";
import { GetContractChangeRequestListUsecaseResponse } from "./response/get-contract-change-requests.usecase.response";
import { ContractChangeRequestListItemDto } from "../dtos/contract-change-request-list.dto";
import { DateUtils } from "@app/shared/utils/date-utils";
import { DateTimePatternType } from "@app/shared/constants/datetime-format.constants";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";

export class GetContractChangeRequestListUsecase
    implements Usecase<GetContractChangeRequestListUsecaseRequest, GetContractChangeRequestListUsecaseResponse>
{
    constructor (
        @Inject(ContractChangeRequestDbRepository)
        private readonly changeRequestRepository: ContractChangeRequestRepository,
    ) { }

    async execute(
        request: GetContractChangeRequestListUsecaseRequest,
        requestContext?: RequestContext,
    ): Promise<Result<GetContractChangeRequestListUsecaseResponse>> {
        const page = await this.changeRequestRepository.findAllAndResponseWithPagination(
            request.filters,
            request.filters?.pageInfo,
        );

        const list: ContractChangeRequestListItemDto[] = [];
        const elements = page?.getElements() ?? [];

        elements.forEach((changeRequest) => {
            const dto = new ContractChangeRequestListItemDto();
            dto.id = changeRequest.id;
            dto.contractId = changeRequest.contract_id;
            dto.changeType = changeRequest.change_type;
            dto.status = changeRequest.status;
            dto.requestedBy = changeRequest.requested_by;
            dto.requestedAt = changeRequest.requested_at
                ? DateUtils.formatDateTime(
                    changeRequest.requested_at,
                    DateTimePatternType.MMM_DD_YYYY_HMS.displayname,
                )
                : "";
            dto.remarks = changeRequest.remarks;
            list.push(dto);
        });

        const pageInfo = new PageInfoDto();
        pageInfo.current = page ? page.getCurrentPage() : request.filters?.pageInfo?.current ?? 0;
        pageInfo.size = page ? page.getSize() : request.filters?.pageInfo?.size ?? 0;

        const response = new GetContractChangeRequestListUsecaseResponse(list, pageInfo);
        return Result.createSuccess(response);
    }
}
