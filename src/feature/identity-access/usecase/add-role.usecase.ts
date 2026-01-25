import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Role } from "../entities/roles.entity";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserRepository } from "../repositories/user.repository";
import { AddRoleUsecaseRequest } from "./request/add-role.usecase.request";
import { AddRoleUsecaseResponse } from "./response/add-role.usecase.response";
@Injectable()
export class AddRoleUsecase implements Usecase<AddRoleUsecaseRequest, AddRoleUsecaseResponse> {
    constructor (
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
    ) { }
    async execute(request: AddRoleUsecaseRequest, requestContext: RequestContext): Promise<Result<AddRoleUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);

        //initializing usecase to use abstract methods
        const addRoleUsecase = new AddRoleUsecase(this.userRepository);


        //finally saving change request to roles change request table
        const response = new AddRoleUsecaseResponse(user.id);
        return Result.createSuccess(response);
    }



    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }
}