import { EmailHandlerModule } from "CMS-BACK-END/src/shared/mailer/mailer.module";
import { Module } from "@nestjs/common";
import { PermissionsCheckerService } from "../auth/services/permissions-checker.service";
import { SystemConfigurationModule } from "../system-configuration/system-configuration.module";
import { WorkflowGroupDbRepository } from "../workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "../workflow/repository/db/workflow-tasks.repository";
import { UserSendEmailConsumer } from "./consumers/user-send-email.consumer";
import { GeneralPolicyController } from "./general-policy.controller";
import { IamMessageProducer } from "./producers/iam-message.producer";
import { BankBranchesDbRepository } from "./repositories/db/bank-branches.repository";
import { GeneralPolicyDbRepository } from "./repositories/db/general-policy.repository";
import { RolesDbRepository } from "./repositories/db/roles.repository";
import { UserChangeRequestDbRepository } from "./repositories/db/user-change-request.repository";
import { UserCredentialDbRepository } from "./repositories/db/user-credential.repository";
import { UserDbRepository } from "./repositories/db/user.repository";
import { RolesController } from "./roles.controller";
import { UserSendEmailService } from "./services/user-send-email.service";
import { AddRoleUsecase } from "./usecases/add-role.usecase";
import { AddUserUsecase } from "./usecases/add-user.usecase";
import { ChangeNewRoleRequestUsecase } from "./usecases/change-new-role-change-request.usecase";
import { ChangeNewUserRequestUsecase } from "./usecases/change-new-user-change-request.usecase";
import { DeleteRoleUsecase } from "./usecases/delete-role.usecase";
import { DeleteUserUsecase } from "./usecases/delete-user.usecase";
import { DenyUserChangeRequestUsecase } from "./usecases/deny-user-change-request.usecase";
import { GetAllRoleUsecase } from "./usecases/get-all-role.usecase";
import { GetBankBranchesForSelectMenuUsecase } from "./usecases/get-bank-branches-for-select-menu.usecase";
import { GetGeneralPolicyUsecase } from "./usecases/get-general-policy.usecase";
import { GetOneUserChangeRequestUsecase } from "./usecases/get-one-user-change-request.usercase";
import { GetOneUserUsecase } from "./usecases/get-one-user.usecase";
import { GetPermissonUsecase } from "./usecases/get-permission.usecase";
import { GetRolesForSelectMenuUsecase } from "./usecases/get-roles-for-select-menu.usecase";
import { GetUserChangeRequestsListUsecase } from "./usecases/get-user-change-requests-list.usecase";
import { GetUsersAndUserChangeRequestsTotalCountUsecase } from "./usecases/get-users-and-user-change-requests-total-count.usecase";
import { GetUsersByRoleUsecase } from "./usecases/get-users-by-role.usecase";
import { GetUsersForSelectMenuUsecase } from "./usecases/get-users-for-select-menu.usecase";
import { GetUsersListUsecase } from "./usecases/get-users-list.usecase";
import { ModifyRoleChangeRequestUsecase } from "./usecases/modify-role-change-request.usecase";
import { ModifyUserChangeRequestUsecase } from "./usecases/modify-user-change-request.usecase";
import { ResetUserPasswordUsecase } from "./usecases/reset-user-password.usecase";
import { ApproveNewRoleChangeRequestUsecase } from "./usecases/role-approve-change-request.usecase";
import { RolesChangeRequestTotalCountUsecase } from "./usecases/roles-change-request-total-count.usecase";
import { RolesDenyChangeRequestUsecase } from "./usecases/roles-deny-change-request.usecase";
import { GetRolesChangeRequestUsecase } from "./usecases/roles-get-change-request.usecase";
import { RolesTotalCountUsecase } from "./usecases/roles-total-count.usecase";
import { RolesViewChangeRequestUsecase } from "./usecases/roles-view-change-request.usecase";
import { SaveGeneralPolicyUsecase } from "./usecases/save-general-policy.usecase";
import { UpdateRoleUsecase } from "./usecases/update-role.usecase";
import { UpdateUserUsecase } from "./usecases/update-user.usecase";
import { ApproveNewUserChangeRequestUsecase } from "./usecases/user-approve-change-request.usecase";
import { ViewRoleUsecase } from "./usecases/view-role.usecase";
import { UsersController } from "./users.controller";
import { MemberBranchesDbRepository } from "../merchants-onboarding/repositories/db/member-branches.repository";

@Module({
	imports: [EmailHandlerModule, SystemConfigurationModule],
	controllers: [RolesController, GeneralPolicyController, UsersController],
	providers: [
		MemberBranchesDbRepository,
		GetUsersByRoleUsecase,
		RolesDbRepository,
		GeneralPolicyDbRepository,
		UserChangeRequestDbRepository,
		UserDbRepository,
		BankBranchesDbRepository,
		UserCredentialDbRepository,
		MemberBranchesDbRepository,
		AddRoleUsecase,
		GetAllRoleUsecase,
		DeleteRoleUsecase,
		UpdateRoleUsecase,
		ViewRoleUsecase,
		GetPermissonUsecase,
		GetRolesChangeRequestUsecase,
		SaveGeneralPolicyUsecase,
		GetGeneralPolicyUsecase,
		RolesViewChangeRequestUsecase,
		AddUserUsecase,
		GetOneUserChangeRequestUsecase,
		GetUsersListUsecase,
		DenyUserChangeRequestUsecase,
		GetUserChangeRequestsListUsecase,
		GetOneUserUsecase,
		DeleteUserUsecase,
		UpdateUserUsecase,
		GetUsersForSelectMenuUsecase,
		GetBankBranchesForSelectMenuUsecase,
		RolesDenyChangeRequestUsecase,
		GetRolesForSelectMenuUsecase,
		GetUsersAndUserChangeRequestsTotalCountUsecase,
		GetUsersByRoleUsecase,
		WorkflowGroupDbRepository,
		WorkflowTasksDbRepository,
		ApproveNewRoleChangeRequestUsecase,
		ChangeNewRoleRequestUsecase,
		ApproveNewUserChangeRequestUsecase,
		ChangeNewUserRequestUsecase,
		GetUsersAndUserChangeRequestsTotalCountUsecase,
		ModifyUserChangeRequestUsecase,
		ModifyRoleChangeRequestUsecase,
		RolesTotalCountUsecase,
		RolesChangeRequestTotalCountUsecase,
		ResetUserPasswordUsecase,
		PermissionsCheckerService,
		IamMessageProducer,
		UserSendEmailConsumer,
		UserSendEmailService,
	],
	exports: [IamMessageProducer],
})
export class IdentityAndAccessModule {}
