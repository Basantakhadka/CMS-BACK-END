import { PermissionsCheckerService } from "@app/feature/auth/services/permissions-checker.service";
import { RolesDbRepository } from "@app/feature/identity-access/repositories/db/roles.repository";
import { UserDbRepository } from "@app/feature/identity-access/repositories/db/user.repository";
import { EmailHandlerModule } from "@app/shared/mailer/mailer.module";
import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SettingsNotificationsByType } from "./entities/setting-notification.entity";
import {
	EmailService,
} from "./notification.service";
import { SettingsNotificationDbRepository } from "./repository/db/setting-notification.repository";
import { ContractAlertsDbRepository } from "../alerts/repositories/db/alerts.repository";
import { ContractDbRepository } from "../contracts/repositories/db/contact.respository";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
	imports: [
		EmailHandlerModule,
		SettingsNotificationDbRepository
	],
	providers: [
		EmailService,
		SettingsNotificationDbRepository,
		PermissionsCheckerService,
		ContractAlertsDbRepository,
		ContractDbRepository,
		UserDbRepository,
		RolesDbRepository,
		ConfigService
	],
	exports: [ EmailService],
})
export class NotificationModule {}
