import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class AddUserUsecaseRequest implements UsecaseRequest{
    constructor(
        public userName:string,
        public userId:string,
        public employeeId:string,
        public branch:string,
        public roles: Array<string>,
        public active:boolean
    ){}
}