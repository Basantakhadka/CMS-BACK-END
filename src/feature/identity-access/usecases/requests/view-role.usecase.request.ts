import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class ViewRoleUsecaseRequest implements UsecaseRequest{
    constructor(
        public roleId:string
    ){}
}