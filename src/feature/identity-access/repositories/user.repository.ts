import { BaseRepository } from "@app/core/repository/base.repository";
import { Page } from "@app/core/repository/search/page";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { LabelValuePair } from "@app/shared/entities/label-value-pair.view";
import { User, UserByRole } from "../entities/user.entity";

export interface UserRepository extends BaseRepository<User, string> {
	findAllLabelValuePairByIds(list: string[]): Promise<LabelValuePair[]>;
	insertUserByRole(entity: UserByRole): Promise<UserByRole>;
	findUsersByRoleId(roleId: string): Promise<UserByRole[]>;
	findByUserId(userId: string): Promise<User>;
	findAllAndResponseWithPagination(
		filters: FilterConditionsDto,
		pageableInfo: any
	): Promise<Page<User>>;
	findByEmployeeId(employeeId: string): Promise<User>;
	deleteUsersByRole(roleId: string, userId?: string): Promise<void>;
	findSavedUsersRoles(userId: string): Promise<UserByRole[]>;
	findUsersInIds(roles: string[]): Promise<User[]>;
	findActiveUserID(userId: string): Promise<User>;
}