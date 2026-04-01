
import { Module } from "@nestjs/common";
// import { PermissionsCheckerService } from "../auth/services/permissions-checker.service";
import { UserDbRepository } from "../identity-access/repositories/db/user.repository";
import { ContractsController } from "./contracts.controller";
import { AddContractUsecase } from "./usecase/add-contract.usecase";
import { ContractDbRepository } from "./repositories/db/contact.respository";
import { PermissionsCheckerService } from "../auth/services/permissions-checker.service";
import { RolesDbRepository } from "../identity-access/repositories/db/roles.repository";
import { UpdateContractUsecase } from "./usecase/update-contract.usecase";
import { DeleteContractUsecase } from "./usecase/delete-contract.usecase";
import { GetContractsListUsecase } from "./usecase/get-contractList.usecase";
import { GetOneContractUsecase } from "./usecase/get-one-contract.usecase";
import {  GetContractsForSelectMenuUsecase } from "./usecase/get-contract-dropdown.usecase";
import { ContractAutoRenewCronUsecase } from "./usecase/auto-renewal-contract-cron.usecase";
import { ContractChangeRequestDbRepository } from "./repositories/db/contract-change-request.db.repository";
import { GetContractChangeRequestListUsecase } from "./usecase/get-contract-change-requests.usecase";
import { GetContractChangeRequestDetailsUsecase } from "./usecase/get-contract-change-request.usecase";
import { ApproveContractChangeRequestUsecase } from "./usecase/approve-contract-change-request.usecase";
import { RejectContractChangeRequestUsecase } from "./usecase/reject-contract-change-request.usecase";


@Module({
    imports: [],
    controllers: [ContractsController],
    providers: [
        PermissionsCheckerService,
        UserDbRepository,
        ContractDbRepository,
        ContractChangeRequestDbRepository,
        AddContractUsecase,
        RolesDbRepository,
        UpdateContractUsecase,
        DeleteContractUsecase,
        GetContractsListUsecase,
        GetOneContractUsecase,
        GetContractsForSelectMenuUsecase,
        ContractAutoRenewCronUsecase,
        GetContractChangeRequestListUsecase,
        GetContractChangeRequestDetailsUsecase,
        ApproveContractChangeRequestUsecase,
        RejectContractChangeRequestUsecase




    ],
    exports: [],
})
export class contracts { }
