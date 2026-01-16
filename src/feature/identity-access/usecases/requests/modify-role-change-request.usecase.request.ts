import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class ModifyRoleChangeRequestUsecaseRequest implements UsecaseRequest{
    constructor(
        public changeRequestId:string,
        public roleId:string,
        public title: string,
        public active: boolean,
        public permissions: string[]
    ){}
}