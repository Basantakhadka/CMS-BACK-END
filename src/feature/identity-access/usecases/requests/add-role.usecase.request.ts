import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class AddRoleUsecaseRequest implements UsecaseRequest{
    constructor(
        public title:string,
        public active: boolean,
        public permission: Array<string>
    ){}
}