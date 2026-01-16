import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class ChangeNewUserRequestUsecaseResponse implements UsecaseResponse{
    constructor(
        public changeRequestId:string,
        public userId:string
    ){}
}