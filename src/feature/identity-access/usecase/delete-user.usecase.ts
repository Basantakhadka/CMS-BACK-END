import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { BadRequestException, ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { User, UserByRole } from "../entities/user.entity";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserRepository } from "../repositories/user.repository";

import { DeleteUserUsecaseRequest } from "./request/delete-user.usecase.request";
import { DeleteUserUsecaseResponse } from "./response/delete-user.usecase.response";
import { UserCredential } from "../entities/user-credential.entity";
import { IdGenerator } from "@app/shared/id-generator";
import { UserPoolService } from "@app/core/cache/user-pool.service";
import { UserCredentialRepository } from "../repositories/user-credential.repository";
import { UserCredentialDbRepository } from "../repositories/db/user-credential.repository";



export class DeleteUserUsecase implements Usecase<DeleteUserUsecaseRequest, DeleteUserUsecaseResponse> {
    constructor (
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
        @Inject(UserPoolService) private userPoolService?: UserPoolService,
        @Inject(UserCredentialDbRepository)
        private userCredentialRepository?: UserCredentialRepository,


    ) { }
    async execute(request: DeleteUserUsecaseRequest, requestContext?: RequestContext): Promise<Result<DeleteUserUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        console.log({ loggedInUser })
        const user = await this.userRepository.findById(request.id);
        console.log({ user })

        if (loggedInUser === request.id) Result.createError(new ForbiddenException("User cannot delete itself!"));


        const savedUser = await this.userRepository.findById(user.id);
        console.log({ savedUser })
        savedUser.deleted = true;
        await this.userRepository.update(savedUser);
        savedUser.roles.forEach(
            async (item) =>
                await this.userRepository.deleteUsersByRole(item.value, savedUser.id)
        );
        await this.handleUserSignoutAfterDelete(user, requestContext);
        //saving requestor task 

        const response = new DeleteUserUsecaseResponse(user.id);
        return Result.createSuccessWithMessage(response, "User deletion completed");
    }

    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }
    private async handleUserSignoutAfterDelete(
        user: User,
        requestContext: RequestContext
    ) {
        const userCredentials = await this.userCredentialRepository.findById(
            user.id
        );
        const newCredentials = new UserCredential();
        newCredentials.id = userCredentials.id;
        newCredentials.version = IdGenerator.generateId();
        await this.userCredentialRepository.update(newCredentials);
        this.userPoolService.revokeSession(
            user?.userId,
            requestContext.getCurrentUser().clientCode

        );
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