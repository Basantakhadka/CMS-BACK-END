import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class GetUserPermissionForApplicationChangeUsecaseResponse implements UsecaseResponse{
    constructor(
        public nextActor:string,
        public hasPermission: boolean
    ){}
}