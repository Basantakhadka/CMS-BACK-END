import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { Role } from "../../entities/roles.entity";

export class ViewRoleUsecaseResponse implements UsecaseResponse{
    constructor(
        public role: Role
    ){}
}