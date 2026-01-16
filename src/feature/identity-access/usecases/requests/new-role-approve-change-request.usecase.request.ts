import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class ApproveNewRoleChangeRequestUsecaseRequest implements UsecaseRequest{
    constructor(
        public changeRequestId:string,
        public roleId:string
    ){}
}