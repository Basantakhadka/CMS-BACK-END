import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { GetItemsForSelectMenuUsecaseRequest } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.request";
import { GetItemsForSelectMenuUsecaseResponse, SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";
import { Inject, NotFoundException } from "@nestjs/common";
import { BankBranchesRepository } from "../repositories/bank-branches.repository";
import { BankBranchesDbRepository } from "../repositories/db/bank-branches.repository";
import { MemberBranchesDbRepository } from "@app/feature/merchants-onboarding/repositories/db/member-branches.repository";

export class GetBankBranchesForSelectMenuUsecase implements Usecase<GetItemsForSelectMenuUsecaseRequest, GetItemsForSelectMenuUsecaseResponse>{
    constructor(
        @Inject(MemberBranchesDbRepository)
        private readonly memberBranchRepository: MemberBranchesDbRepository
    ){}
    async execute(request: GetItemsForSelectMenuUsecaseRequest, requestContext?: RequestContext): Promise<Result<GetItemsForSelectMenuUsecaseResponse>> {
        const bankBranches = await this.memberBranchRepository.findAll();
        if(bankBranches.length <= 0){
            return Result.createErrorWithMessage(new NotFoundException(), "No branches found");
        }else{
            let bankBranchesList:SelectMenu[] = [];
            bankBranches.forEach(branch=>{
                const selectMenu = new SelectMenu(branch.title,branch.code);
                bankBranchesList.push(selectMenu);
            })
            const response = new GetItemsForSelectMenuUsecaseResponse(bankBranchesList);
            return Result.createSuccess(response.data);
        }

    }
    
}