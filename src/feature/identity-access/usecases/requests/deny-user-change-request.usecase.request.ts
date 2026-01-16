import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";
import { DenyChangeRequisitionRequestDto } from "../../../../shared/dtos/deny-change-requisition-request.dto";

export class DenyUserChangeRequestUsecaseRequest implements UsecaseRequest{
    constructor(
        public id:string,
        public refId:string,
        public denialReason:string
    ){}
}