import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { LabelValuePair } from "@app/shared/entities/label-value-pair.view";

export class GetUsersByRoleUsecaseResponse implements UsecaseResponse{
    constructor(
        public users: LabelValuePair[]
    ){}
}