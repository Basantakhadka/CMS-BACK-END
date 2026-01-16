import { IMessage } from "CMS-BACK-END/src/shared/mailer/mailer-interfaces";
import { EmailHandlerService } from "CMS-BACK-END/src/shared/mailer/mailer.service";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SparrowSmsService } from "../sparrowSms/sparrow-sms.service";
import { PushNotificationProperties } from "./push-notification-properties.interface";
import { SettingsNotificationDbRepository } from "./repository/db/setting-notification.repository";
import { SettingsNotificationRepository } from "./repository/setting-notification.repository";
import { SmsProperties } from "./sms-properties.interface";
import { IMailConfigDto } from "CMS-BACK-END/src/shared/mailer/dto/email-option-dto";

@Injectable()
export class SmsService {
	constructor(
		private readonly sparrowSmsService: SparrowSmsService,
		@Inject(SettingsNotificationDbRepository)
		private readonly getMessageConfig: SettingsNotificationRepository,
		private readonly config: ConfigService
	) {}
	async sendSms(properties: SmsProperties) {
		let getSmsConfig = null;
		let setting = null;
		if (this.config.get("SMS_SERVICE")) {
			getSmsConfig = await this.getMessageConfig.getMessageConfigDetailsByType(
				"SMS",
				this.config.get("SMS_SERVICE")
			);
		} else {
			getSmsConfig = await this.getMessageConfig.getMessageConfigDetailsByType(
				"SMS",
				"DEFAULT"
			);
		}
		setting = JSON.parse(getSmsConfig.config);
		try {
			await this.sparrowSmsService.sendSms(properties, setting);
		} catch (error) {
			console.error(`Error sending message`, error);
		}
	}
}

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
		console.log("EMAIL RESPONSE =========>", emailResponse);

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


@Injectable()
export class PushNotificationService {
  async sendPushNotification(properties: PushNotificationProperties) {
    // Call a third-party service for sending a push notification
  }
}
