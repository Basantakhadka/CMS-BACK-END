import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { IamEntityStatus } from "@app/shared/constants/Iam-entity-status";
import { DateTimePatternType } from "@app/shared/constants/datetime-format.constants";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { GetRoleUsecaseRequest } from "./request/get-role.usecase.request";
import {
    GetRoleUsecaseResponse,
    RoleListReponse,
} from "./response/get-role.usecase.response";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { DateUtils } from "@app/shared/utils/date-utils";

@Injectable()
export class GetAllRoleUsecase implements Usecase<GetRoleUsecaseRequest, GetRoleUsecaseResponse> {
    constructor (
        @Inject(RolesDbRepository) private readonly rolesRepository: RolesRepository
    ) { }
    async execute(request?: GetRoleUsecaseRequest, requestContext?: RequestContext): Promise<Result<GetRoleUsecaseResponse>> {
        let pageInfo = request.data.pageInfo;
        console.log({ request })

        if (pageInfo.current !== 1) {
            Result.createError(new BadRequestException("Invalid Request"));
        }
        const rolesListWithpageInfo = await this.rolesRepository.findAllRolesWithPagination(request.data, request.data.pageInfo);
        console.log({ rolesListWithpageInfo })
        const rolesList = rolesListWithpageInfo.getElements();
        const rolesListResponse: RoleListReponse[] = [];
        rolesList.forEach((item) => {
            let lastModifiedOn = null;
            if (item.createdOn) {
                var createdOn = DateUtils.formatDateTime(item.createdOn, DateTimePatternType.MMM_DD_YYYY_HMS.displayname);
            }
            if (item.lastModifiedOn) {
                lastModifiedOn = DateUtils.formatDateTime(item.lastModifiedOn, DateTimePatternType.MMM_DD_YYYY_HMS.displayname);
            }
            const status = item.active ? IamEntityStatus.ACTIVE.displayName : IamEntityStatus.INACTIVE.displayName;
            const role = new RoleListReponse(item.id, item.title, createdOn, lastModifiedOn, status);
            rolesListResponse.push(role);
        })
        let pageInfos = new PageInfoDto();
        pageInfos.current = rolesListWithpageInfo.getCurrentPage()
        pageInfos.size = rolesListWithpageInfo.getSize();
        const response = new GetRoleUsecaseResponse(rolesListResponse, pageInfos);
        return Result.createSuccess(response);
    }
}