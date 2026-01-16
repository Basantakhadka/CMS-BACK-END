import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class UpdateUserUsecaseRequest implements UsecaseRequest{
    constructor(
        public id:string,
        public userName:string,
        public userId:string,
        public employeeId:string,
        public branch:string,
        public roles: Array<string>,
        public active:boolean
    ){}
}