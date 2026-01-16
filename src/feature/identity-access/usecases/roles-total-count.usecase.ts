import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { RolesTotalCountUsecaseResponse } from "./response/roles-total-count.usecase.response";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Result } from "@app/feature/common/result";
import { Inject, Injectable } from "@nestjs/common";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { RolesTotalCountUsecaseRequest } from "./requests/roles-total-count.usecase.request";
@Injectable()
export class RolesTotalCountUsecase implements Usecase<RolesTotalCountUsecaseRequest, RolesTotalCountUsecaseResponse>{
    constructor(
        @Inject(RolesDbRepository) private readonly rolesRepository: RolesRepository
    ){}
    async execute(request?: RolesTotalCountUsecaseRequest, requestContext?: RequestContext): Promise<Result<RolesTotalCountUsecaseResponse>> {
        const roleCount = await this.rolesRepository.findTotalCount();
        const response = new RolesTotalCountUsecaseResponse(roleCount);
        return Result.createSuccess(response);
    }
}