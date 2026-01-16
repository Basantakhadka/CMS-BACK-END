import { EmailService } from "CMS-BACK-END/src/core/notification/notification.service";
import { Inject, Injectable } from "@nestjs/common";
import { IUserEmailMessage } from "../producers/iam-message.producer";

@Injectable()
export class UserSendEmailService {
	constructor(
		@Inject(EmailService)
		private readonly emailService: EmailService
	) {}
	async sendEmailToCreatedUser(emailProperties: IUserEmailMessage) {
		try {
			await this.emailService.sendEmail(emailProperties);
		} catch (error) {
			console.error(
				`Failed to send email to ${emailProperties.emailProperties.to}`,
				error
			);
		}
	}
}