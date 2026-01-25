import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { GeneralPolicy } from "../../entities/general-policy.entity";

export class SaveGeneralPolicyUsecaseResponse implements UsecaseResponse{
    constructor(public data:GeneralPolicy){}
}