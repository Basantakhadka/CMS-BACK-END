import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { IamEntityStatus } from "CMS-BACK-END/src/shared/constants/Iam-entity-status";
import { DateTimePatternType } from "CMS-BACK-END/src/shared/constants/datetime-format.constants";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { PageInfoDto } from "CMS-BACK-END/src/shared/response-dtos/page-info-response.dto";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { GetRoleUsecaseRequest } from "./requests/get-role.usecase.request";
import {
	GetRoleUsecaseResponse,
	RoleListReponse,
} from "./response/get-role.usecase.response";

@Injectable()
export class GetAllRoleUsecase implements Usecase<GetRoleUsecaseRequest, GetRoleUsecaseResponse>{
    constructor(
        @Inject(RolesDbRepository) private readonly rolesRepository: RolesRepository
    ){}
    async execute(request?: GetRoleUsecaseRequest, requestContext?:RequestContext): Promise<Result<GetRoleUsecaseResponse>> {
        let pageInfo = request.data.pageInfo;
        if(pageInfo.current === 0 && pageInfo.target === 0){
            pageInfo.target = 1;
        }
        if(pageInfo.target - pageInfo.current !== 1){
            Result.createError(new BadRequestException("Invalid Request"));
        }
        const rolesListWithpageInfo = await this.rolesRepository.findAllRolesWithPagination(request.data,request.data.pageInfo);
        const rolesList = rolesListWithpageInfo.getElements();
        const rolesListResponse: RoleListReponse[] = [];
        rolesList.forEach((item)=>{
            let lastModifiedOn = null;
            if(item.createdOn){
                var createdOn = DateUtils.formatDateTime(item.createdOn,DateTimePatternType.MMM_DD_YYYY_HMS.displayname);
            }
            if(item.lastModifiedOn ){
                lastModifiedOn = DateUtils.formatDateTime(item.lastModifiedOn,DateTimePatternType.MMM_DD_YYYY_HMS.displayname);
            }
            const status  = item.active ? IamEntityStatus.ACTIVE.displayName : IamEntityStatus.INACTIVE.displayName;
            const role = new RoleListReponse(item.id,item.title,createdOn,lastModifiedOn, status);
            rolesListResponse.push(role);
        })
        let pageInfos=new PageInfoDto();
        pageInfos.current=rolesListWithpageInfo.getCurrentPage();
        pageInfos.target=rolesListWithpageInfo.getTargetPage();
        pageInfos.size=rolesListWithpageInfo.getSize();
        pageInfos.state=rolesListWithpageInfo.getCurrentPageState();
        const response = new GetRoleUsecaseResponse(rolesListResponse, pageInfos);
        return Result.createSuccess(response);
    }
}