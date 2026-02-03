import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class GetOneContractUsecaseRequest implements UsecaseRequest{
    constructor(public id:string){}
}