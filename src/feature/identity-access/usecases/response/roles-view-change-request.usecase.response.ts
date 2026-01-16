import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { Role } from "../../entities/roles.entity";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";

export class RolesViewChangeRequestUsecaseResponse implements UsecaseResponse{
    constructor(
        public id:string,
        public roleId:string,
        public requestedBy: string,
        public requestType: string,
        public data: RoleChangeRequestViewReponse[]
    ){}
}
export class RoleChangeRequestViewReponse{
    title: string;
    fieldData: {fields: LabelValuePair[], originalValue: object | null, changedValue: object | null};
}

export class FinalResult{
    constructor(
      public title:string,
      public permissions:any
    ){}
  }