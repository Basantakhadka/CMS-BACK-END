import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { Role } from "../../entities/roles.entity";

export class UpdateRoleUsecaseResponse implements UsecaseResponse {
    constructor (
        public role: string,
    ) { }
}