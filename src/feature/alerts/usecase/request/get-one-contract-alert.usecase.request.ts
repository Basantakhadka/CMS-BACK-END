import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class GetOneContractAlertUsecaseRequest implements UsecaseRequest{
    constructor(public id:string){}
}