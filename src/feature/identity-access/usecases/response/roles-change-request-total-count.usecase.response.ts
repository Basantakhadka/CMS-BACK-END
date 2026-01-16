import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class RolesChangeRequestTotalCountUsecaseResponse implements UsecaseResponse{
    constructor(
        public totalCount:number
    ){}
}