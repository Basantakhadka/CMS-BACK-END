import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class DeleteRoleUsecaseResponse implements UsecaseResponse{
    constructor(
        public roleId: string,
        public changeRequestId: string
    ){}
}