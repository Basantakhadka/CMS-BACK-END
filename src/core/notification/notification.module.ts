import { PermissionsCheckerService } from "CMS-BACK-END/src/feature/auth/services/permissions-checker.service";
import { RolesDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/roles.repository";
import { UserDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user.repository";
import { EmailHandlerModule } from "CMS-BACK-END/src/shared/mailer/mailer.module";
import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SparrowSmsModule } from "../sparrowSms/sparrow-sms.module";
import { SettingsNotificationsByType } from "./entities/setting-notification.entity";
import {
	EmailService,
	PushNotificationService,
	SmsService,
} from "./notification.service";
import { SettingsNotificationDbRepository } from "./repository/db/setting-notification.repository";

@Global()
@Module({
	imports: [
		SparrowSmsModule,
		EmailHandlerModule,
		TypeOrmModule.forFeature([SettingsNotificationsByType]),
	],
	providers: [
		SmsService,
		EmailService,
		PushNotificationService,
		SettingsNotificationDbRepository,
		PermissionsCheckerService,
		UserDbRepository,
		RolesDbRepository,
	],
	exports: [SmsService, EmailService, PushNotificationService],
})
export class NotificationModule {}
