import { BaseRepository } from "@app/core/repository/base.repository";
import { Page } from "@app/core/repository/search/page";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { LabelValuePair } from "@app/shared/entities/label-value-pair.view";
import { ContractAlert } from "../entities/alerts.entity";


export interface ContractAlertsRepository extends BaseRepository<ContractAlert, string> {
    findAllLabelValuePairByIds(list: string[]): Promise<LabelValuePair[]>;
    findByAlertsId(userId: string): Promise<ContractAlert>;
    findAllAndResponseWithPagination(
        filters: FilterConditionsDto,
        pageableInfo: any
    ): Promise<Page<ContractAlert>>;
    findUsersInIds(roles: string[]): Promise<ContractAlert[]>;
    findActiveUserID(userId: string): Promise<ContractAlert>;
}