import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class GetUserPermissionForApplicationChangeUsecaseRequest implements UsecaseRequest{
    constructor(
        public applicationId: string,
    ){}
}