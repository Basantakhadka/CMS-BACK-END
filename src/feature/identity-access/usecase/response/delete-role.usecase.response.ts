import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class DeleteRoleUsecaseResponse implements UsecaseResponse {
    constructor (
        public roleId: string,
    ) { }
}