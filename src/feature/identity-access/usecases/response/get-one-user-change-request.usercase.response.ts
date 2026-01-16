import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { ChangeRequisitionDetailResponseDto } from "../../../../shared/dtos/change-requisition-detail-response";

export class GetOneUserChangeRequestUsecaseResponse implements UsecaseResponse{
    constructor(public data: ChangeRequisitionDetailResponseDto){}
}