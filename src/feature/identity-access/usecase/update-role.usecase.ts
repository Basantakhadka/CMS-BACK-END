import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Role } from "../entities/roles.entity";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UpdateRoleUsecaseRequest } from "./request/update-role.usecase.request";
import { UpdateRoleUsecaseResponse } from "./response/update-role.usecase.response";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class UpdateRoleUsecase implements Usecase<UpdateRoleUsecaseRequest, UpdateRoleUsecaseResponse> {
    constructor (
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
    ) { }
    async execute(request: UpdateRoleUsecaseRequest, requestContext: RequestContext): Promise<Result<UpdateRoleUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);

        // user.roles.forEach((item) => {
        //     if (item.value === request.id) Result.createError(new ForbiddenException("User cannot modify its role!"));
        // })
        let savedData: Role;
        await this.rolesRepository.findById(request.id).then((data) => savedData = data);
        if (!savedData) {
            return Result.createErrorWithMessage(new NotFoundException(), "Role Not Found!")
        }


        let role = new Role();
        role.id = request.id;
        role.active = request.active;
        role.permissions = request.permissions;
        role.title = request.title;
        role.contract = request?.contractIds || [];
        await this.rolesRepository.save(role);

        const response = new UpdateRoleUsecaseResponse(user.id);
        return Result.createSuccess(response);
    }


    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }

}