import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { BadRequestException, ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { User, UserByRole } from "../entities/user.entity";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserRepository } from "../repositories/user.repository";

import { DeleteUserUsecaseRequest } from "./request/delete-user.usecase.request";
import { DeleteUserUsecaseResponse } from "./response/delete-user.usecase.response";



export class DeleteUserUsecase implements Usecase<DeleteUserUsecaseRequest, DeleteUserUsecaseResponse> {
    constructor (
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,

    ) { }
    async execute(request: DeleteUserUsecaseRequest, requestContext?: RequestContext): Promise<Result<DeleteUserUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);

        if (loggedInUser === request.id) Result.createError(new ForbiddenException("User cannot delete itself!"));


        const updateUserUsecase = new DeleteUserUsecase(this.userRepository);
        //saving requestor task 

        const response = new DeleteUserUsecaseResponse(user.id);
        return Result.createSuccessWithMessage(response, "User deletion in progress");
    }

    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }

    private async validateSavedUser(id: string) {
        const savedUser = await this.userRepository.findById(id);
        if (!savedUser) {
            throw new NotFoundException("User not found");
        }
        if (savedUser.deleted === true) {
            throw new NotFoundException("User already deleted");
        }
        return savedUser;
    }

}