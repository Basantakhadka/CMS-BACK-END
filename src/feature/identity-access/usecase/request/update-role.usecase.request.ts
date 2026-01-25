import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class UpdateRoleUsecaseRequest implements UsecaseRequest{
    constructor(
        public id:string,
        public title:string,
        public active: boolean,
        public permissions: Array<string>
    ){}
}