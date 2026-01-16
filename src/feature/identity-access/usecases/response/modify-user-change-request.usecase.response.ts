import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class ModifyUserChangeRequestUsecaseResponse implements UsecaseResponse{
    constructor(
        public refId:string,
        public changeRequestId:string
    ){}
}