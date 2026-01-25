import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class RolesTotalCountUsecaseResponse implements UsecaseResponse{
    constructor(
        public totalCount:number
    ){}
}