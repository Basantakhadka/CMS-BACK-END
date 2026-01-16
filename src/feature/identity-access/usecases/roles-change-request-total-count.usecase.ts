import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Result } from "@app/feature/common/result";
import { Inject, Injectable } from "@nestjs/common";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { RolesChangeRequestTotalCountUsecaseResponse } from "./response/roles-change-request-total-count.usecase.response";
import { RolesChangeRequestTotalCountUsecaseRequest } from "./requests/roles-change-request-total-count.usecase.request";
@Injectable()
export class RolesChangeRequestTotalCountUsecase implements Usecase<RolesChangeRequestTotalCountUsecaseRequest, RolesChangeRequestTotalCountUsecaseResponse>{
    constructor(
        @Inject(RolesDbRepository) private readonly rolesRepository: RolesRepository
    ){}
    async execute(request?: RolesChangeRequestTotalCountUsecaseRequest, requestContext?: RequestContext): Promise<Result<RolesChangeRequestTotalCountUsecaseResponse>> {
        const roleCount = await this.rolesRepository.findTotalChangeRequestCount();
        const response = new RolesChangeRequestTotalCountUsecaseResponse(roleCount);
        return Result.createSuccess(response);
    }
}