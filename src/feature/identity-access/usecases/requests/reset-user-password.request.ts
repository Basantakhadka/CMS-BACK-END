import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";
export class ResetUserPasswordUsecaseRequest implements UsecaseRequest{
    constructor(
        public userId:string
    ){}
}