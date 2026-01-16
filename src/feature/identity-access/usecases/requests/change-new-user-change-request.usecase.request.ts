import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class ChangeNewUserRequestUsecaseRequest implements UsecaseRequest{
    constructor(
        public changeRequestId:string,
        public userId:string,
        public comments: string
    ){}
}