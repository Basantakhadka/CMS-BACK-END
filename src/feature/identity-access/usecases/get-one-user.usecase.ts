import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject, NotFoundException } from "@nestjs/common";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserRepository } from "../repositories/user.repository";
import { GetOneUserUsecaseRequest } from "./requests/get-one-user.usecase.request";
import { GetOneUserUsecaseResponse } from "./response/get-one-user.usecase.response";
import { IamEntityStatus } from "CMS-BACK-END/src/shared/constants/Iam-entity-status";

export class GetOneUserUsecase implements Usecase<GetOneUserUsecaseRequest, GetOneUserUsecaseResponse>{
    constructor(
        @Inject(UserDbRepository)
        private readonly userRepostiory: UserRepository
    ) {}
    async execute(request: GetOneUserUsecaseRequest, requestContext?: RequestContext): Promise<Result<GetOneUserUsecaseResponse>> {
       const savedUser = await this.userRepostiory.findById(request.id);
       if(!savedUser){
        return Result.createErrorWithMessage(new NotFoundException(), "Cannot find user");
       }else{
            savedUser['status'] = {label: IamEntityStatus.getByBoolValue(savedUser.active)?.userStatus, value: savedUser.active};
            delete savedUser.active;
           const response = new GetOneUserUsecaseResponse(savedUser);
           return Result.createSuccess(response.data);
       }
    }
    
}