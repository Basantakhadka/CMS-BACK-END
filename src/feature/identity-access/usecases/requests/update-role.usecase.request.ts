import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class UpdateRoleUsecaseRequest implements UsecaseRequest{
    constructor(
        public id:string,
        public title:string,
        public active: boolean,
        public permissions: Array<string>
    ){}
}