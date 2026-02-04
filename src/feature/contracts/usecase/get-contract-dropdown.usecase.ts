// usecase/get-contracts-for-select-menu.usecase.ts
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { ContractRepository } from "../repositories/contract.repository";
import { GetItemsForSelectMenuUsecaseRequest } from "@app/shared/utils/get-items-for-select-menu.usecase.request";
import { GetItemsForSelectMenuUsecaseResponse, SelectMenu } from "@app/shared/utils/get-items-for-select-menu.usecase.response";
import { ContractDbRepository } from "../repositories/db/contact.respository";

@Injectable()
export class GetContractsForSelectMenuUsecase implements Usecase<GetItemsForSelectMenuUsecaseRequest, GetItemsForSelectMenuUsecaseResponse> {
    constructor(
        @Inject(ContractDbRepository)
        private readonly contractRepository: ContractRepository
    ) {}

    async execute(
        request?: GetItemsForSelectMenuUsecaseRequest,
        requestContext?: RequestContext
    ): Promise<Result<GetItemsForSelectMenuUsecaseResponse>> {

        // 1️⃣ Fetch all contracts
        const contracts = await this.contractRepository.findAll();
        console.log({ contracts });

        let contractsList: SelectMenu[] = [];

        const elements = contracts;

        if (elements.length > 0) {
            elements.forEach((contract) => {
                if (!contract.deleted) { // only non-deleted contracts
                    contractsList.push({
                        label: contract.contract_title,
                        value: contract.id
                    });
                }
            });

            // 2️⃣ Sort alphabetically
            contractsList.sort((a, b) => {
                const labelA = a.label.toUpperCase();
                const labelB = b.label.toUpperCase();
                if (labelA < labelB) return -1;
                if (labelA > labelB) return 1;
                return 0;
            });

            // 3️⃣ Return response
            const response = new GetItemsForSelectMenuUsecaseResponse(contractsList);
            return Result.createSuccess(response);
        } else {
            return Result.createErrorWithMessage(new NotFoundException(), "Contracts Not Found!");
        }
    }
}
