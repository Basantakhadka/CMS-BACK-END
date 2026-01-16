import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { RoleChangeRequest } from "../../entities/roles.entity";
import { PageInfoDto } from "CMS-BACK-END/src/shared/response-dtos/page-info-response.dto";
import { SortMeta } from "CMS-BACK-END/src/core/repository/search/sort.meta";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";

export class RolesGetChangeRequestUsecaseResponse implements UsecaseResponse{
    constructor(
       public list:RolesChangeRequestListResponse[],
       public pageInfo:PageInfoDto
    ){}
}
export class RolesChangeRequestListResponse{
    constructor(
        public refId: string,
        public id: string,
        public title:string,
        public userId:string,
        public createdOn:string,
        public requestedOn:string,
        public type: string,
        public requestedBy: LabelValuePair,
        public status: string
    ){}
}