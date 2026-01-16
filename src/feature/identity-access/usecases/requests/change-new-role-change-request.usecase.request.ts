import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class ChangeNewRoleRequestUsecaseRequest implements UsecaseRequest{
    constructor(
        public changeRequestId:string,
        public roleId:string,
        public comments: string
    ){}
}