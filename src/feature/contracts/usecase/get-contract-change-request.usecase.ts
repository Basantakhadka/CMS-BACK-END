import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ContractChangeRequestDbRepository } from "../repositories/db/contract-change-request.db.repository";
import { ContractChangeRequestRepository } from "../repositories/contract-change-request.repository";
import { Inject, NotFoundException } from "@nestjs/common";
import { GetContractChangeRequestDetailsUsecaseRequest } from "./request/get-contract-change-request.usecase.request";
import { GetContractChangeRequestDetailsUsecaseResponse } from "./response/get-contract-change-request.usecase.response";
import { ContractChangeRequestDetailDto } from "../dtos/contract-change-request-detail.dto";
import { DateUtils } from "@app/shared/utils/date-utils";
import { DateTimePatternType } from "@app/shared/constants/datetime-format.constants";

export class GetContractChangeRequestDetailsUsecase
    implements Usecase<GetContractChangeRequestDetailsUsecaseRequest, GetContractChangeRequestDetailsUsecaseResponse>
{
    constructor (
        @Inject(ContractChangeRequestDbRepository)
        private readonly changeRequestRepository: ContractChangeRequestRepository,
    ) { }

    async execute(
        request: GetContractChangeRequestDetailsUsecaseRequest,
        requestContext?: RequestContext,
    ): Promise<Result<GetContractChangeRequestDetailsUsecaseResponse>> {
        const changeRequest = await this.changeRequestRepository.findById(request.id);

        if (!changeRequest) {
            return Result.createErrorWithMessage(new NotFoundException(), "Change request not found");
        }

        const dto = new ContractChangeRequestDetailDto();
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
        dto.approvedBy = changeRequest.approved_by;
        dto.approvedAt = changeRequest.approved_at
            ? DateUtils.formatDateTime(
                changeRequest.approved_at,
                DateTimePatternType.MMM_DD_YYYY_HMS.displayname,
            )
            : undefined;
        dto.remarks = changeRequest.remarks;
        dto.oldData = changeRequest.old_data ?? null;
        dto.newData = changeRequest.new_data ?? null;

        const response = new GetContractChangeRequestDetailsUsecaseResponse(dto);
        return Result.createSuccess(response);
    }
}
