import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Injectable, Inject } from "@nestjs/common";
import { BadRequestException, NotFoundException } from "@nestjs/common/exceptions";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { RolesGetChangeRequestUsecaseRequest } from "./requests/roles-get-change-request.usecase.request";
import { RolesChangeRequestListResponse, RolesGetChangeRequestUsecaseResponse } from "./response/roles-get-change-request.usecase.response";
import { PageInfoDto } from "CMS-BACK-END/src/shared/response-dtos/page-info-response.dto";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserRepository } from "../repositories/user.repository";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { DateTimePatternType } from "CMS-BACK-END/src/shared/constants/datetime-format.constants";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
@Injectable()
export class GetRolesChangeRequestUsecase implements Usecase<RolesGetChangeRequestUsecaseRequest,RolesGetChangeRequestUsecaseResponse>{
    constructor(
        @Inject(RolesDbRepository) private readonly rolesRepository: RolesRepository,
        @Inject(UserDbRepository) private readonly userRepository: UserRepository
    ){}
    async execute(request: RolesGetChangeRequestUsecaseRequest, requestContext?: RequestContext): Promise<Result<RolesGetChangeRequestUsecaseResponse>> {
        let pageInfo = request.data.pageInfo;
        if(pageInfo.current === 0 && pageInfo.target === 0){
            pageInfo.target = 1;
        }
        if(pageInfo.target - pageInfo.current !== 1){
            Result.createError(new BadRequestException("Invalid Request"));
        }
        const data = await this.rolesRepository.findAllChangeRequestWithPagination(request.data,request.data.pageInfo);
        const changeRequests = data.getElements();
        const rolesChangeRequesListRes:RolesChangeRequestListResponse[] = [];
        if(changeRequests.length>0){
            for (let i in changeRequests){
                changeRequests[i].createdOn = DateUtils.formatDateTime(changeRequests[i].createdOn,DateTimePatternType.MMM_DD_YYYY_HMS.displayname);
                changeRequests[i].requestedOn = DateUtils.formatDateTime(changeRequests[i].requestedOn,DateTimePatternType.MMM_DD_YYYY_HMS.displayname);
                changeRequests[i].status = ChangeRequestStatus.getByName(changeRequests[i].status)?.displayname;
                const userId = changeRequests[i]['userId'] = (await this.userRepository.findById(changeRequests[i].requestedBy.value))?.userId;
                const roleChangeRequest = new RolesChangeRequestListResponse(
									changeRequests[i].refId,
									changeRequests[i].id,
									changeRequests[i].title,
									userId,
									changeRequests[i].createdOn,
									changeRequests[i].requestedOn,
									ChangeRequestType.getByName(changeRequests[i].type)?.displayname,
									changeRequests[i].requestedBy,
									changeRequests[i].status
								);
                rolesChangeRequesListRes.push(roleChangeRequest);
            }
        }
        let pageInfos=new PageInfoDto();
        pageInfos.current=data.getCurrentPage();
        pageInfos.target=data.getTargetPage();
        pageInfos.size=data.getSize();
        pageInfos.state=data.getCurrentPageState();
        const response = new RolesGetChangeRequestUsecaseResponse(rolesChangeRequesListRes,pageInfos);
        return  Result.createSuccess(response);
    }
}