import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { Role } from "../../entities/roles.entity";

export class AddRoleUsecaseResponse implements UsecaseResponse {
    constructor (
        public roleId: string
    ) { }
}