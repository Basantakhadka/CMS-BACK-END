import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class GetUsersAndUserChangeRequestsTotalCountUsecaseResponse implements UsecaseResponse{
    constructor(
        public totalUsers:number,
        public totalUsersChangeRequest:number
    ){}
}