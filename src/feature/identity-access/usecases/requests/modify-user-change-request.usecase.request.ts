import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class ModifyUserChangeRequestUsecaseRequest implements UsecaseRequest{
    constructor(
        public changeRequestId:string,
        public userId:string,
        public email:string,
        public userName:string,
        public employeeId:string,
        public branch:string,
        public roles: Array<string>,
        public active:boolean
    ){}
}