import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class ChangeNewRoleRequestUsecaseResponse implements UsecaseResponse{
    constructor(
        public changeRequestId:string,
        public roleId:string
    ){}
}