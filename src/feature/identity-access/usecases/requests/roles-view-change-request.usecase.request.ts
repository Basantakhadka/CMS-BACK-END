import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class RolesViewChangeRequestUsecaseRequest implements UsecaseRequest{
    constructor(
        public roleId:string,
        public id:string
    ){}
}