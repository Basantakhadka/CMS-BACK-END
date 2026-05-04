import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ForbiddenException, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { ApproveContractChangeRequestUsecaseRequest } from "./request/approve-contract-change-request.usecase.request";
import { ApproveContractChangeRequestUsecaseResponse } from "./response/approve-contract-change-request.usecase.response";
import { ContractChangeRequestDbRepository } from "../repositories/db/contract-change-request.db.repository";
import { ContractChangeRequestRepository } from "../repositories/contract-change-request.repository";
import { ContractDbRepository } from "../repositories/db/contact.respository";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractChangeRequestStatus, ContractChangeRequestType } from "../constants/change-request.constants";
import { Contract } from "../entities/contracts.entity";
import { hydrateContractEntityFromSnapshot, ContractSnapshot } from "../utils/contract-change-request.util";
import { IdGenerator } from "@app/shared/id-generator";

export class ApproveContractChangeRequestUsecase
    implements Usecase<ApproveContractChangeRequestUsecaseRequest, ApproveContractChangeRequestUsecaseResponse>
{
    constructor (
        @Inject(ContractChangeRequestDbRepository)
        private readonly changeRequestRepository: ContractChangeRequestRepository,
        @Inject(ContractDbRepository)
        private readonly contractRepository: ContractRepository,
    ) { }

    async execute(
        request: ApproveContractChangeRequestUsecaseRequest,
        requestContext?: RequestContext,
    ): Promise<Result<ApproveContractChangeRequestUsecaseResponse>> {
        const clientCode = requestContext?.getCurrentUser()?.clientCode;
        const approver = requestContext?.getCurrentUser()?.userId ?? "SYSTEM";

        if (!clientCode) {
            throw new ForbiddenException("Missing client context");
        }

        const changeRequest = await this.changeRequestRepository.findById(request.id);
        console.log("Fetched Change Request:", changeRequest);

        if (!changeRequest || changeRequest.client_code !== clientCode) {
            throw new NotFoundException("Change request not found");
        }

        if (changeRequest.status !== ContractChangeRequestStatus.PENDING) {
            throw new BadRequestException("Only pending change requests can be approved");
        }

        if (changeRequest.requested_by === approver) {
            throw new BadRequestException("Creator cannot approve their own change request");
        }

        let contractId = changeRequest.contract_id;

        if (changeRequest.change_type === ContractChangeRequestType.CREATE) {
            const snapshot = (changeRequest.new_data ?? {}) as ContractSnapshot;
            snapshot.client_code = clientCode;
            const newContractId = IdGenerator.generateId("v4");
            const contractEntity: Contract = hydrateContractEntityFromSnapshot(snapshot, newContractId);
            contractEntity.created_at = new Date();
            contractEntity.updated_at = new Date();
            await this.contractRepository.insert(contractEntity);
            contractId = contractEntity.id;
        } else if (changeRequest.change_type === ContractChangeRequestType.UPDATE) {
            if (!contractId) {
                throw new BadRequestException("Missing contract reference for update request");
            }
            const snapshot = (changeRequest.new_data ?? {}) as ContractSnapshot;
            snapshot.client_code = clientCode;
            await this.contractRepository.update({
                ...snapshot,
                id: contractId,
                client_code: clientCode,
                updated_at: new Date(),
            });
        } else if (changeRequest.change_type === ContractChangeRequestType.DELETE) {
            if (!contractId) {
                throw new BadRequestException("Missing contract reference for delete request");
            }
            await this.contractRepository.update({
                id: contractId,
                deleted: true,
                client_code: clientCode,
                updated_at: new Date(),
            });
        } else {
            throw new BadRequestException("Unsupported change request type");
        }

        changeRequest.status = ContractChangeRequestStatus.APPROVED;
        changeRequest.approved_at = new Date();
        changeRequest.approved_by = approver;
        changeRequest.remarks = request.remarks ?? changeRequest.remarks;
        changeRequest.contract_id = contractId;

        await this.changeRequestRepository.delete(changeRequest);

        const response = new ApproveContractChangeRequestUsecaseResponse(changeRequest.id, contractId);
        return Result.createSuccessWithMessage(response, "Change request approved successfully");
    }
}
