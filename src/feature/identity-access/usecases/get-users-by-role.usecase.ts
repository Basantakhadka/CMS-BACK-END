import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject, Injectable } from "@nestjs/common";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserRepository } from "../repositories/user.repository";
import { GetUsersByRoleUsecaseRequest } from "./requests/get-users-by-role.usecase.request";
import { GetUsersByRoleUsecaseResponse } from "./response/get-users-by-role.usecase.response";
@Injectable()
export class GetUsersByRoleUsecase implements Usecase<GetUsersByRoleUsecaseRequest,GetUsersByRoleUsecaseResponse>{
    constructor(
        @Inject(UserDbRepository) private readonly userRepostiory: UserRepository
    ){}
    async execute(request: GetUsersByRoleUsecaseRequest, requestContext?: RequestContext): Promise<Result<GetUsersByRoleUsecaseResponse>> {
        const data = await this.userRepostiory.findUsersByRoleId(request.roleId);
        if(data.length === 0){
            return Result.createSuccessWithMessage(new GetUsersByRoleUsecaseResponse([]),"No Users with this role!");
        }
        const userIds:string[] = [];
        data.forEach((item)=> userIds.push(item.userId));
        const usersByRoleAsLabelVal = await this.userRepostiory.findAllLabelValuePairByIds(userIds);
        const response = new GetUsersByRoleUsecaseResponse(usersByRoleAsLabelVal);
        return Result.createSuccess(response);
    }
}