import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";

export class GetUsersByRoleUsecaseResponse implements UsecaseResponse{
    constructor(
        public users: LabelValuePair[]
    ){}
}