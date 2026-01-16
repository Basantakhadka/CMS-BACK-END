import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";
import { GetOneUserChangeRequestDto } from "../../dtos/get-one-user-change-request.dto";

export class GetOneUserChangeRequestUsecaseRequest implements UsecaseRequest{
    constructor(public id:string, public refId:string){}
}