import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class ApproveNewRoleChangeRequestUsecaseResponse implements UsecaseResponse{
    constructor(
        public requestId:string
    ){}
}