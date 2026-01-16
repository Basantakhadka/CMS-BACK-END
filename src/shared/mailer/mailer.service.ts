import { Injectable, Logger } from "@nestjs/common";
import juice from "juice";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import pug from "pug";

import { IMailConfig, IMailOptions, IMailResponse } from "./mailer-interfaces";
import { existsSync } from "fs";

@Injectable()
export class EmailHandlerService {
	async sendEmail(
		options: IMailOptions,
		mailConfig: any
	): Promise<IMailResponse> {
		try {
			const server: Mail = await this.getEmailServer(mailConfig);

			const mailOptions: Mail.Options = {
				from: mailConfig.fromEmail,
				to: options.to,
				subject: options.subject,
				attachments: options.attachments,
			};

			// if template name is exist then choose pug template from views
			if (options.templateName) {
				const html = await this.getTemplate(
					options.templateName,
					options.replace
				);
				mailOptions.html = html;
			}
			const checkedAttachments = [];
			if(mailOptions.attachments && mailOptions.attachments.length > 0){
				for(const item of mailOptions.attachments){
					const isFile = existsSync(item.path.toString());
					if(isFile) {
						checkedAttachments.push(item);
					}
				}
			}
			mailOptions.attachments = checkedAttachments;

			// if text body then assign as text
			if (options.body) {
				mailOptions.text = options.body;
			}

			// if html body then assign as html
			if (options.htmlBody) {
				mailOptions.html = options.htmlBody;
			}

		
			const info = await server.sendMail(mailOptions);
			return {
				success: true,
				item: info,
			};
		} catch (error) {
			Logger.error("EMAIL SEND ERROR ============>");
			console.log(error);
			return {
				success: false,
				errors: error,
			};
		}
	}

	private async getTemplate(
		templateName: string,
		options: Record<string, any> = {}
	): Promise<string> {
		const html: string = pug.renderFile(
			`${__dirname}/email-templates/${templateName}.pug`,
			options
		);
		return juice(html);
	}

	private async getEmailServer(mailConfig: any): Promise<Mail> {
		const { otherProperties, ...basicProperties } = mailConfig;
		const transportProperties = {
			...otherProperties, ...basicProperties
		}
		return nodemailer.createTransport({ ...transportProperties });
	}
}
