import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { Role } from "../../entities/roles.entity";

export class AddRoleUsecaseResponse implements UsecaseResponse{
    constructor(
        public changeRequestId: string,
        public roleId: string
    ){}
}