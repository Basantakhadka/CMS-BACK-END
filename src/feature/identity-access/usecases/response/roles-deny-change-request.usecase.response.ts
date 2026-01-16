import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class RolesDenyChangeRequestUsecaseResponse implements UsecaseResponse{
    constructor(
        public changeRequest:string
    ){}
}