import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { User } from "../../entities/user.entity";

export class GetOneUserUsecaseResponse implements UsecaseResponse{
    constructor(public data: User){}
}