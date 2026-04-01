import { IMessage } from "@app/shared/mailer/mailer-interfaces";
import { EmailHandlerService } from "@app/shared/mailer/mailer.service";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SettingsNotificationDbRepository } from "./repository/db/setting-notification.repository";
import { SettingsNotificationRepository } from "./repository/setting-notification.repository";
import { IMailConfigDto } from "@app/shared/mailer/dto/email-option-dto";


@Injectable()
export class EmailService {
	constructor(
		private readonly emailService: EmailHandlerService,
		@Inject(SettingsNotificationDbRepository)
		private readonly getMessageConfig: SettingsNotificationRepository,
		private readonly config: ConfigService
	) {}
	async sendEmail(properties: IMessage): Promise<void> {
		let getEmailConfig = null;

		if (this.config.get("EMAIL_SERVICE")) {
			getEmailConfig =
				await this.getMessageConfig.getMessageConfigDetailsByType(
					"EMAIL",
					this.config.get("EMAIL_SERVICE")
				);
		} else {
			getEmailConfig =
				await this.getMessageConfig.getMessageConfigDetailsByType(
					"EMAIL",
					"DEFAULT"
				);
		}

		const config = JSON.parse(getEmailConfig.config);
		const { fromEmail, host, port, secure, authUser, authPassword, ...otherProperties } = config;
		const mailConfig = new IMailConfigDto();
		mailConfig.fromEmail = fromEmail;
		mailConfig.host = host;
		mailConfig.port = port;
		mailConfig.secure = secure;
		mailConfig.auth.user = authUser;
		mailConfig.auth.pass = authPassword;
		mailConfig.otherProperties = otherProperties;

		const emailResponse = await this.emailService.sendEmail(
			properties.emailProperties,
			mailConfig
		);

		if (emailResponse.success) {
			Logger.debug(
				`Successfully sent email to ${JSON.stringify(
					emailResponse.item?.envelope?.to
				)}`
			);
		} else {
			console.error(`Failed to send email`, emailResponse.errors);
		}
	}
}

