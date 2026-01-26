import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Role } from "../entities/roles.entity";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { DeleteRoleUsecaseRequest } from "./request/delete-role.usecase.request";
import { DeleteRoleUsecaseResponse } from "./response/delete-role.usecase.response";
import { BadRequestException, ForbiddenException } from "@nestjs/common/exceptions";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserByRole } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
@Injectable()
export class DeleteRoleUsecase implements Usecase<DeleteRoleUsecaseRequest, DeleteRoleUsecaseResponse> {
    constructor (
        @Inject(UserDbRepository) private readonly userRepository: UserRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
    ) { }
    async execute(request: DeleteRoleUsecaseRequest, requestContext: RequestContext): Promise<Result<DeleteRoleUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);
        user.roles.forEach((item) => {
            if (item.value === request.roleId) Result.createError(new ForbiddenException("User cannot delete its role!"));
        })
        let savedRole: Role = await this.rolesRepository.findById(request.roleId);
        if (!savedRole || savedRole?.deleted) {
            Result.createErrorWithMessage(new NotFoundException(), "Role Not Found!")
        }
        const usersByRole: UserByRole[] = await this.getUsersbyRole(request.roleId);
        if (usersByRole.length > 0) {
            const users = await this.userRepository.findUsersInIds(usersByRole.map((item) => item.userId));
            users.forEach((item) => {
                if (item.active) {
                    return Result.createError(new BadRequestException("Cannot delete. Role assigned to active user!"));
                }
            });
        }
        const role = new Role();
        role.deleted = true;
        role.id = request.roleId;
        await this.userRepository.deleteUsersByRole(role.id);
        await this.rolesRepository.save(role);
        const response = new DeleteRoleUsecaseResponse(request.roleId);
        return Result.createSuccessWithMessage(response, "Role Deleted successfully");
    }



    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }


}