import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { PageInfoDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { Inject, NotAcceptableException } from "@nestjs/common";
import { GetUserChangeRequestListResponseDto } from "../dtos/get-user-change-request-list-response.dto";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { GetUserChangeRequestsListUsecaseRequest } from "./requests/get-user-change-requests-list.usecase.request";
import { GetUserChangeRequestsListUsecaseResponse } from "./response/get-user-change-requests-list.usecase.response";
import { DateTimePatternType } from "CMS-BACK-END/src/shared/constants/datetime-format.constants";

export class GetUserChangeRequestsListUsecase implements Usecase<GetUserChangeRequestsListUsecaseRequest, GetUserChangeRequestsListUsecaseResponse>{
    constructor(
        @Inject(UserChangeRequestDbRepository)
        private readonly userChangeRequestRepository: UserChangeRequestRepository,
    ){}
    async execute(request: GetUserChangeRequestsListUsecaseRequest, requestContext?: RequestContext): Promise<Result<GetUserChangeRequestsListUsecaseResponse>> {
        const userChangeRequestList = await this.userChangeRequestRepository.findAllAndResponseWithPagination(request.data, request.data.pageInfo);
        let usersResponse: GetUserChangeRequestListResponseDto[] = [];
        
        if(!userChangeRequestList){
            return Result.createErrorWithMessage(new NotAcceptableException(), "No user found");
        }else{
            let elements=[];
            let elementWithchangedColumnsNames=[];
            elements = userChangeRequestList.getElements();
            elements.forEach(user=>{
                const users = new GetUserChangeRequestListResponseDto();
                users.id = user.id;
                users.refId = user.refId;
                users.userName = user.userName;
                users.employeeId = user.employeeId;
                users.userId = user.userId;
                users.branch = user.branch;
                users.requestedOn = user.requestedOn?DateUtils.formatDateTime(user.requestedOn,DateTimePatternType.MMM_DD_YYYY_HMS.displayname):null;
                users.requestedBy = user.requestedBy?.label;
                users.type = ChangeRequestType.getByName(user.type)?.displayname;
                users.status = ChangeRequestStatus.getByName(user.status)?.displayname;
                usersResponse.push(users);
            })
            let pageInfos=new PageInfoDto();
            pageInfos.current = userChangeRequestList.getCurrentPage() ? userChangeRequestList.getCurrentPage() : request.data.pageInfo.target;
            pageInfos.target = userChangeRequestList.getTargetPage() ? userChangeRequestList.getTargetPage() + 1 : request.data.pageInfo.target + 1;
            pageInfos.size = userChangeRequestList.getSize() ? userChangeRequestList.getSize() : request.data.pageInfo.size;
            pageInfos.state=userChangeRequestList.getCurrentPageState();
            const response = new GetUserChangeRequestsListUsecaseResponse(usersResponse, pageInfos)
            return Result.createSuccess(response);
        }
    }
}