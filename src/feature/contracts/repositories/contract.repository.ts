import { BaseRepository } from "@app/core/repository/base.repository";
import { Page } from "@app/core/repository/search/page";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { LabelValuePair } from "@app/shared/entities/label-value-pair.view";
import { Contract } from "../entities/contracts.entity";

export interface ContractRepository extends BaseRepository<Contract, string> {
    findAllLabelValuePairByIds(list: string[]): Promise<LabelValuePair[]>;
    findByContractId(userId: string): Promise<Contract>;
    findAllAndResponseWithPagination(
        filters: FilterConditionsDto,
        pageableInfo: any
    ): Promise<Page<Contract>>;
    findByEmployeeId(employeeId: string): Promise<Contract>;
    findUsersInIds(roles: string[]): Promise<Contract[]>;
    findActiveUserID(userId: string): Promise<Contract>;
}