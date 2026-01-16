import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
export class ResetUserPasswordUsecaseResponse implements UsecaseResponse{
    constructor(
        public userId:string
    ){}
}
