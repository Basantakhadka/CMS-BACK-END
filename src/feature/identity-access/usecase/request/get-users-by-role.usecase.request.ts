import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class GetUsersByRoleUsecaseRequest implements UsecaseRequest{
    constructor(
        public roleId:string
    ){}
}