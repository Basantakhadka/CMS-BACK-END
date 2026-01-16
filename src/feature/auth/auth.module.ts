import { JwtStrategy } from "CMS-BACK-END/src/core/auth/JwtStrategy";
import { NotificationModule } from "CMS-BACK-END/src/core/notification/notification.module";
import { OtpDbRepository } from "CMS-BACK-END/src/core/otp/db/otp.repository";
import { OtpService } from "CMS-BACK-END/src/core/otp/otp.service";
import { Module } from "@nestjs/common";
import { IdentityAndAccessModule } from "../identity-access/identity-access.module";
import { GeneralPolicyDbRepository } from "../identity-access/repositories/db/general-policy.repository";
import { RolesDbRepository } from "../identity-access/repositories/db/roles.repository";
import { UserCredentialDbRepository } from "../identity-access/repositories/db/user-credential.repository";
import { UserDbRepository } from "../identity-access/repositories/db/user.repository";
import { SystemConfigurationDbRepository } from "../system-configuration/repositories/db/system-configuration.repository";
import { WorkflowGroupDbRepository } from "../workflow/repository/db/workflow-group.repository";
import { AuthController } from "./auth.controller";
import { MFAEmailConsumer } from "./consumers/mfa-email.consumer";
import { AuthMessageProducer } from "./producers/auth-message.producer";
import { PermissionsCheckerService } from "./services/permissions-checker.service";
import { UserLoginService } from "./services/user-login.service";
import { changePasswordUsecase } from "./usecases/change-password.usecase";
import { SendLoginOtpUsecase } from "./usecases/send-login-otp.usecase";
import { UserLoginUsecase } from "./usecases/user-login.usecase";
import { UserLogoutUsecase } from "./usecases/user-logout.usecase";
import { VerifyLoginOtpUsecase } from "./usecases/verify-login-otp.usecase";
@Module({
	imports: [],
	controllers: [AuthController],
	providers: [
		UserLoginUsecase,
		UserLogoutUsecase,
		UserCredentialDbRepository,
		UserDbRepository,
		GeneralPolicyDbRepository,
		RolesDbRepository,
		changePasswordUsecase,
		JwtStrategy,
		WorkflowGroupDbRepository,
		PermissionsCheckerService,
		SystemConfigurationDbRepository,
		SendLoginOtpUsecase,
		VerifyLoginOtpUsecase,
		OtpService,
		OtpDbRepository,
		UserLoginService,
		AuthMessageProducer,
		MFAEmailConsumer,
	],
	exports: [
		PermissionsCheckerService,
		UserDbRepository,
		RolesDbRepository,
		UserCredentialDbRepository,
	],
})
export class AuthModule {}
