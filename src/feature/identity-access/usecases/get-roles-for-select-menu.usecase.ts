import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { GetItemsForSelectMenuUsecaseRequest } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.request";
import { GetItemsForSelectMenuUsecaseResponse, SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
@Injectable()
export class GetRolesForSelectMenuUsecase implements Usecase<GetItemsForSelectMenuUsecaseRequest,GetItemsForSelectMenuUsecaseResponse>{
    constructor(
        @Inject(RolesDbRepository) private readonly rolesRepository: RolesRepository
    ){}
    async execute(request?: GetItemsForSelectMenuUsecaseRequest, requestContext?: RequestContext): Promise<Result<GetItemsForSelectMenuUsecaseResponse>> {
        const roles = await this.rolesRepository.findAll();
        let rolesList: Array<SelectMenu> = [];
        if(roles.length>0){
            roles.forEach((itm)=>{
                if(itm.active === true){
                    rolesList.push(
                        {
                            label:itm?.title,
                            value:itm?.id
                        }
                    )
                }
            })
            rolesList.sort((a,b)=> {
                const labela = a.label.toLocaleUpperCase();
                const labelb = b.label.toLocaleUpperCase();
                if(labela < labelb){
                    return -1;
                }
                if(labela > labelb){
                    return 1;
                }
                return 0;
            });
            const response = new GetItemsForSelectMenuUsecaseResponse(rolesList);
            return Result.createSuccess(response)
        }else{
            return Result.createErrorWithMessage(new NotFoundException(),"Roles Not Found!");
        }
    }
}