import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class UpdateUserUsecaseResponse implements UsecaseResponse{
    constructor(
        public id:string,
        public refId:string
    ){}
}