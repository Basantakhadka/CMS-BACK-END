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
import { CacheFactory } from "@app/core/cache/cache.factory";
import { IdGenerator } from "@app/shared/id-generator";
import { DateUtils } from "@app/shared/utils/date-utils";

@Injectable()
export class AddRoleUsecase implements Usecase<AddRoleUsecaseRequest, AddRoleUsecaseResponse> {
    constructor (
        @Inject(UserDbRepository)
        private readonly userRepository: UserRepository,

        @Inject(RolesDbRepository)
        private readonly rolesRepository: RolesRepository,

        private readonly cacheFactory: CacheFactory
    ) { }

    async execute(
        request: AddRoleUsecaseRequest,
        requestContext: RequestContext
    ): Promise<Result<AddRoleUsecaseResponse>> {

        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // 🔹 Check if role already exists
        const existingRole = await this.rolesRepository.findById(request.title);
        if (existingRole) {
            return Result.createError(
                new BadRequestException(`Role "${ request.title }" already exists`)
            );
        }

        // 🔹 Create new role
        const role = new Role();
        role.id = IdGenerator.generateId();
        role.deleted =false;
        role.title = request.title;
        role.permissions = request.permission;
        role.active = request.active;
        role.createdOn = DateUtils.convertToString(DateUtils.getCurrentFullDate());
        role.contract = request.contractIds || [];

        // 🔹 Save role
        await this.rolesRepository.insert(role);

        // 🔹 Cache (optional)
        await this.cacheRole(`ROLE_${ role.id }`, role);

        return Result.createSuccess(new AddRoleUsecaseResponse(role.id));
    }

    private async cacheRole(key: string, value: any) {
        await this.cacheFactory.cacheData(key, value);
    }
}
