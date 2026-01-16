import { BaseRepository } from "CMS-BACK-END/src/core/repository/base.repository";
import { Page } from "CMS-BACK-END/src/core/repository/search/page";
import { FilterConditionsDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { UserChangeRequest } from "../entities/user-change-request.entity";

export interface UserChangeRequestRepository extends BaseRepository<UserChangeRequest, string>{
    findByIds(entity:UserChangeRequest):Promise<UserChangeRequest[]>;
	findAllAndResponseWithPagination(filters: FilterConditionsDto, pageableInfo: any): Promise<Page<UserChangeRequest>>;
    findByUserId(userId:string):Promise<UserChangeRequest>;
    findByEmployeeId(employeeId:string):Promise<UserChangeRequest>;
    findChangeRequestByRefIdAndRequestId(refId:string, changeRequestId:string):Promise<UserChangeRequest>;
    findCountByRefIdAndChangeRequestStatus(refId: string, changeRequestStatus:string):Promise<number>;
} 