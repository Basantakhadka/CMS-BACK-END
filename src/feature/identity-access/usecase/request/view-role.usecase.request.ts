import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class ViewRoleUsecaseRequest implements UsecaseRequest{
    constructor(
        public roleId:string
    ){}
}