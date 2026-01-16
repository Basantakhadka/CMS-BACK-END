import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class RolesTotalCountUsecaseResponse implements UsecaseResponse{
    constructor(
        public totalCount:number
    ){}
}