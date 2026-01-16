import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { GeneralPolicy } from "../../entities/general-policy.entity";

export class GetGeneralPolicyUsecaseResponse implements UsecaseResponse{
    constructor(public data: GeneralPolicy){}
}