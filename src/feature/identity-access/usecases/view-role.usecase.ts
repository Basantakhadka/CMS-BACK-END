import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { ViewRoleUsecaseRequest } from "./requests/view-role.usecase.request";
import { ViewRoleUsecaseResponse } from "./response/view-role.usecase.response";
@Injectable()
export class ViewRoleUsecase implements Usecase<ViewRoleUsecaseRequest, ViewRoleUsecaseResponse>{
    constructor(
        @Inject(RolesDbRepository) private readonly rolesRepository: RolesRepository
    ){}
    async execute(request: ViewRoleUsecaseRequest): Promise<Result<ViewRoleUsecaseResponse>> {
        const role = await this.rolesRepository.findById(request.roleId);
        if(role && role.deleted == false){
            delete role.deleted;
            delete role.deletedOn;
            delete role.deletedBy;
            const response = new ViewRoleUsecaseResponse(role);
            return Result.createSuccess(response);
        }
        return Result.createErrorWithMessage(new NotFoundException(),"Role Not Found!");
    }
}