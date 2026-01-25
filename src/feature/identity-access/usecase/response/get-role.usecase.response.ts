import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { Role } from "../../entities/roles.entity";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";


export class GetRoleUsecaseResponse implements UsecaseResponse {
    constructor (
        public list: RoleListReponse[],
        public pageInfo: PageInfoDto
    ) { }
}

export class RoleListReponse {
    constructor (
        public id: string,
        public title: string,
        public createdOn: string,
        public lastModifiedOn: string,
        public status: string
    ) { }
}