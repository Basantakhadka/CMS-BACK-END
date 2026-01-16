import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { SearchMeta } from "CMS-BACK-END/src/core/repository/search/search.meta";
import { Inject, Injectable } from "@nestjs/common";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { UserRepository } from "../repositories/user.repository";
import { GetUsersAndUserChangeRequestsTotalCountUsecaseRequest } from "./requests/get-users-and-user-change-requests-total-count.usecase.request";
import { GetUsersAndUserChangeRequestsTotalCountUsecaseResponse } from "./response/get-users-and-user-change-requests-total-count.usecase.response";

@Injectable()
export class GetUsersAndUserChangeRequestsTotalCountUsecase implements Usecase<GetUsersAndUserChangeRequestsTotalCountUsecaseRequest, GetUsersAndUserChangeRequestsTotalCountUsecaseResponse>{
    constructor(
        @Inject(UserDbRepository)
        private readonly userRepository:UserRepository,
        @Inject(UserChangeRequestDbRepository)
        private readonly userChangeRequestRepository: UserChangeRequestRepository
    ){}
    async execute(request: GetUsersAndUserChangeRequestsTotalCountUsecaseRequest, requestContext?: RequestContext): Promise<Result<GetUsersAndUserChangeRequestsTotalCountUsecaseResponse>> { 
        const searchMeta = new SearchMeta(); 
        searchMeta.filters = request.filter; 
        const totalUsers = await this.userRepository.findTotalCountWithFilters(searchMeta);
        const totalUsersChangeRequest = await this.userChangeRequestRepository.findTotalCount();
        const response = new GetUsersAndUserChangeRequestsTotalCountUsecaseResponse(totalUsers, totalUsersChangeRequest);
        return Result.createSuccess(response);
    }
}