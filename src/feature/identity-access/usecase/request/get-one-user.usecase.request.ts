import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class GetOneUserUsecaseRequest implements UsecaseRequest{
    constructor(public id:string){}
}