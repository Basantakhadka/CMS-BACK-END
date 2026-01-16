import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class RolesDenyChangeRequestUsecaseRequest implements UsecaseRequest{
    constructor(
        public id:string,
        public roleId:string,
        public deniedReason:string
    ){}
}