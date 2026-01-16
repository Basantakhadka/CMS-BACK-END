import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class GetOneUserUsecaseRequest implements UsecaseRequest{
    constructor(public id:string){}
}