
import { Module } from "@nestjs/common";
import { UserCredentialDbRepository } from "./repositories/db/user-credential.repository";
import { UserDbRepository } from "./repositories/db/user.repository";
import { UsersController } from "./users.controller";
import { GetUsersListUsecase } from "./usecase/get-users-list.usecase";
import { GetOneUserUsecase } from "./usecase/get-one-user.usecase";
import { DeleteUserUsecase } from "./usecase/delete-user.usecase";
import { UpdateUserUsecase } from "./usecase/update-user.usecase";
import { GeneralPolicyDbRepository } from "./repositories/db/general-policy.repository";
import { SaveGeneralPolicyUsecase } from "./usecase/save-general-policy.usecase";
import { GetGeneralPolicyUsecase } from "./usecase/get-general-policy.usecase";
import { GeneralPolicyController } from "./general-policy.controller";
import { RolesController } from "./roles.controller";
import { AddRoleUsecase } from "./usecase/add-role.usecase";
import { GetAllRoleUsecase } from "./usecase/get-all-role.usecase";
import { DeleteRoleUsecase } from "./usecase/delete-role.usecase";
import { UpdateRoleUsecase } from "./usecase/update-role.usecase";
import { ViewRoleUsecase } from "./usecase/view-role.usecase";
import { GetPermissonUsecase } from "./usecase/get-permission.usecase";
import { RolesDbRepository } from "./repositories/db/roles.repository";
import { GetRolesForSelectMenuUsecase } from "./usecase/get-roles-for-select-menu.usecase";
import { RolesTotalCountUsecase } from "./usecase/roles-total-count.usecase";
import { GetUsersByRoleUsecase } from "./usecase/get-users-by-role.usecase";
import { AddUserUsecase } from "./usecase/add-user.usecase";
import { PermissionsCheckerService } from "../auth/services/permissions-checker.service";
import { EmailHandlerModule } from "@app/shared/mailer/mailer.module";
import { ClientsController } from "./clients.controller";
import { AddClientUsecase } from "./usecase/add-client.usecase";
import { ClientDbRepository } from "./repositories/db/client.repository";
import { GetClientsUsecase } from "./usecase/get-clients.usecase";


@Module({
	imports: [EmailHandlerModule],
	controllers: [UsersController, GeneralPolicyController, RolesController, ClientsController],
	providers: [

		UserDbRepository,
		UserCredentialDbRepository,
		GetUsersListUsecase,
		AddUserUsecase,
		GetOneUserUsecase,
		DeleteUserUsecase,
		UpdateUserUsecase,
		GeneralPolicyDbRepository,
		SaveGeneralPolicyUsecase,
		GetGeneralPolicyUsecase,
		RolesDbRepository,
		AddRoleUsecase,
		GetAllRoleUsecase,
		DeleteRoleUsecase,
		UpdateRoleUsecase,
		ViewRoleUsecase,
		GetPermissonUsecase,
		GetRolesForSelectMenuUsecase,
		RolesTotalCountUsecase,
		GetUsersByRoleUsecase,
		PermissionsCheckerService,
		ClientDbRepository,
		AddClientUsecase,
		GetClientsUsecase




	],
	exports: [],
})
export class IdentityAndAccessModule { }
