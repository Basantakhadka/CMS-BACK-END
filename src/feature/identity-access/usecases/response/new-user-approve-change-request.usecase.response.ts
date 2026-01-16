import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class ApproveNewUserChangeRequestUsecaseResponse implements UsecaseResponse{
    constructor(
        public requestId:string
    ){}
}