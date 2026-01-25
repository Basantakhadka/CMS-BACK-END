import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";

import { SelectMenu } from "@app/shared/utils/get-items-for-select-menu.usecase.response";
import { BadRequestException, ForbiddenException, Inject, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserRepository } from "../repositories/user.repository";
import { UpdateUserUsecaseRequest } from "./request/update-user.usecase.request";
import { UpdateUserUsecaseResponse } from "./response/update-user.usecase.response";
import { User } from "../entities/user.entity";

export class UpdateUserUsecase implements Usecase<UpdateUserUsecaseRequest, UpdateUserUsecaseResponse> {
    constructor (
        @Inject(UserDbRepository) private readonly userRepository: UserRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
    ) { }
    async execute(request: UpdateUserUsecaseRequest, requestContext?: RequestContext): Promise<Result<UpdateUserUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);

        if (loggedInUser === request.id) Result.createError(new ForbiddenException("User cannot modify itself!"));
        await this.validateSavedUser(request.id);
        await this.validateUserAttributeExists(request);
        const updateUserUsecase = new UpdateUserUsecase(this.userRepository);

        //saving requestor task 


        const response = new UpdateUserUsecaseResponse(user.id);
        return Result.createSuccessWithMessage(response, "Update operation requested.");
    }

    private async validateSavedUser(id: string) {
        const savedUser = await this.userRepository.findById(id);
        if (!savedUser) {
            Result.createError(new NotFoundException("User not found"));
        }
        if (savedUser.deleted === true) {
            Result.createError(new NotFoundException("User already deleted"));
        }
        return savedUser;
    }
    private async validateUserAttributeExists(request: UpdateUserUsecaseRequest): Promise<boolean> {
        let userIdInUserExists: User, employeeIdInUserExists: User;
        userIdInUserExists = await this.userRepository.findByUserId(request.userId);
        if (userIdInUserExists && userIdInUserExists.id !== request.id) {
            Result.createErrorWithMessage(new NotAcceptableException(`User ID: ${ request.userId } already exists`), "Duplicate User ID");
        }

        return false;
    }


    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }


    private async validateRoles(roles: Array<string>): Promise<SelectMenu[]> {
        let rolesList: SelectMenu[] = [];
        for (let i = 0; i < roles.length; i++) {
            const savedRole = await this.rolesRepository.findById(roles[i]);
            if (!roles) {
                throw new NotFoundException(`Cannot find roles`);
            }
            const rolesMenu = new SelectMenu(savedRole.title, savedRole.id);
            rolesList.push(rolesMenu);
        }
        return rolesList;
    }

}