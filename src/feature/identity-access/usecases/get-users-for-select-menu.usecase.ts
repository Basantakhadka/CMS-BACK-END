import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { GetItemsForSelectMenuUsecaseRequest } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.request";
import { GetItemsForSelectMenuUsecaseResponse, SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";
import { NotFoundException } from "@nestjs/common";
import { Inject } from "@nestjs/common/decorators/core/inject.decorator";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserRepository } from "../repositories/user.repository";

export class GetUsersForSelectMenuUsecase implements Usecase<GetItemsForSelectMenuUsecaseRequest, GetItemsForSelectMenuUsecaseResponse>{
    constructor(
        @Inject(UserDbRepository)
        private readonly userRepository: UserRepository
    ){}
    async execute(request: GetItemsForSelectMenuUsecaseRequest, requestContext?: RequestContext): Promise<Result<GetItemsForSelectMenuUsecaseResponse>> {
        const users = await this.userRepository.findAll();
        if(users.length <=0){
            return Result.createErrorWithMessage(new NotFoundException(), "Users not found")
        }else {
            let usersSelectMenu: SelectMenu[] =[];
            users.forEach(user => {
                const selectMenu = new SelectMenu(user.userName,user.id);
                usersSelectMenu.push(selectMenu);
            });
            const response = new GetItemsForSelectMenuUsecaseResponse(usersSelectMenu);
            return Result.createSuccess(response.data);
        }
    }
    
}