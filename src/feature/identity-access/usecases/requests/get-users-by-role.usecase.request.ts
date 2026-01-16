import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class GetUsersByRoleUsecaseRequest implements UsecaseRequest{
    constructor(
        public roleId:string
    ){}
}