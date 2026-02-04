
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


@Module({
    imports: [],
    controllers: [ContractsController],
    providers: [
        PermissionsCheckerService,
        UserDbRepository,
        ContractDbRepository,
        AddContractUsecase,
        RolesDbRepository,
        UpdateContractUsecase,
        DeleteContractUsecase,
        GetContractsListUsecase,
        GetOneContractUsecase,
        GetContractsForSelectMenuUsecase




    ],
    exports: [],
})
export class contracts { }
