import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class DeleteRoleUsecaseRequest implements UsecaseRequest{
    constructor(
        public roleId: string
    ){}
}