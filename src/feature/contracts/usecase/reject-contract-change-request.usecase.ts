import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ContractChangeRequestDbRepository } from "../repositories/db/contract-change-request.db.repository";
import { ContractChangeRequestRepository } from "../repositories/contract-change-request.repository";
import { BadRequestException, ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { RejectContractChangeRequestUsecaseRequest } from "./request/reject-contract-change-request.usecase.request";
import { RejectContractChangeRequestUsecaseResponse } from "./response/reject-contract-change-request.usecase.response";
import { ContractChangeRequestStatus } from "../constants/change-request.constants";

export class RejectContractChangeRequestUsecase
    implements Usecase<RejectContractChangeRequestUsecaseRequest, RejectContractChangeRequestUsecaseResponse>
{
    constructor (
        @Inject(ContractChangeRequestDbRepository)
        private readonly changeRequestRepository: ContractChangeRequestRepository,
    ) { }

    async execute(
        request: RejectContractChangeRequestUsecaseRequest,
        requestContext?: RequestContext,
    ): Promise<Result<RejectContractChangeRequestUsecaseResponse>> {
        const clientCode = requestContext?.getCurrentUser()?.clientCode;
        const approver = requestContext?.getCurrentUser()?.loginId ?? "SYSTEM";

        if (!clientCode) {
            throw new ForbiddenException("Missing client context");
        }

        const changeRequest = await this.changeRequestRepository.findById(request.id);

        if (!changeRequest || changeRequest.client_code !== clientCode) {
            throw new NotFoundException("Change request not found");
        }

        if (changeRequest.status !== ContractChangeRequestStatus.PENDING) {
            throw new BadRequestException("Only pending change requests can be rejected");
        }

        changeRequest.status = ContractChangeRequestStatus.REJECTED;
        changeRequest.approved_at = new Date();
        changeRequest.approved_by = approver;
        changeRequest.remarks = request.remarks;

        await this.changeRequestRepository.update(changeRequest);

        const response = new RejectContractChangeRequestUsecaseResponse(changeRequest.id);
        return Result.createSuccessWithMessage(response, "Change request rejected successfully");
    }
}
