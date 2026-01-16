import { UserPoolService } from "CMS-BACK-END/src/core/cache/user-pool.service";
import { hashPassword } from "CMS-BACK-END/src/core/hashing/hashing";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { SystemConfigurationDbRepository } from "@app/feature/system-configuration/repositories/db/system-configuration.repository";
import { SystemConfigurationRepository } from "@app/feature/system-configuration/repositories/system-configuration.repository";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";
import { IMailOptions } from "CMS-BACK-END/src/shared/mailer/mailer-interfaces";
import { generateRandomPassword } from "CMS-BACK-END/src/shared/utils/password-generator";
import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import path from "path";
import { IamMessageProducer } from "../producers/iam-message.producer";
import { UserCredentialDbRepository } from "../repositories/db/user-credential.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserCredentialRepository } from "../repositories/user-credential.repository";
import { UserRepository } from "../repositories/user.repository";
import { ResetUserPasswordUsecaseRequest } from "./requests/reset-user-password.request";
import { ResetUserPasswordUsecaseResponse } from "./response/reset-user-password.response";
import { ExportEmailConfigEnvDto } from "CMS-BACK-END/src/shared/dtos/export-email-config-env.dto";
import { parseJsonFromString } from "CMS-BACK-END/src/shared/utils/json-parser-utils";
import { EmailService } from "CMS-BACK-END/src/core/notification/notification.service";
export class ResetUserPasswordUsecase
	implements
		Usecase<ResetUserPasswordUsecaseRequest, ResetUserPasswordUsecaseResponse>
{
	constructor(
		private readonly als: AsyncLocalStorage<RequestContext>,
		@Inject(UserCredentialDbRepository)
		private readonly userCredentialRepository: UserCredentialRepository,
		@Inject(UserDbRepository)
		private readonly userRepository: UserRepository,
		@Inject(SystemConfigurationDbRepository)
		private readonly systemConfigurationRepository: SystemConfigurationRepository,
		@Inject(UserPoolService)
		private userPoolService: UserPoolService,
		@Inject(IamMessageProducer)
		private readonly iamMessageProducer: IamMessageProducer,
		@Inject(EmailService)
		private readonly emailService: EmailService
	) {}
	async execute(
		request: ResetUserPasswordUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<ResetUserPasswordUsecaseResponse>> {
		const { userId } = request;
		const password = generateRandomPassword();
		const user = await this.userRepository.findById(userId);
		if (!user) {
			return Result.createErrorWithMessage(
				new NotFoundException(),
				"User not found"
			);
		}

		let exportEmailConfig: ExportEmailConfigEnvDto;
		if (
			process.env.EMAIL_CONFIG === null ||
			process.env.EMAIL_CONFIG === undefined
		) {
			exportEmailConfig = {
				poweredByLogoPath: "",
				showPoweredBy: false,
				merchantOnboardPoweredByLogoPath: "",
			};
		} else {
			exportEmailConfig = parseJsonFromString<ExportEmailConfigEnvDto>(
				process.env.EMAIL_CONFIG
			);
		}

		//TO DO : validate if user exists
		const hashedPassword = await hashPassword(password, userId, user.userId);
		await this.userCredentialRepository.update({
			id: userId,
			enforcePasswordChange: true,
			password: hashedPassword,
			expiryTime: null,
			version: IdGenerator.generateId("4"),
			blocked: false,
		});

		const institutionInfoInfo =
			await this.systemConfigurationRepository.findAll();
		const institutionInfo = institutionInfoInfo[0];

		const configKey = JSON.parse(institutionInfo?.configKey);
		const institutionName = configKey?.institutionName;
		const institutionLargeLogo = configKey?.institutionLargeLogo;

		const showPoweredByLogo = exportEmailConfig.showPoweredBy;
		const poweredByLogoPath = exportEmailConfig.poweredByLogoPath;

		const attachments = [
			{
				fileName: "getpay",
				path: poweredByLogoPath
					? path.resolve(__dirname, poweredByLogoPath)
					: "",
				cid: "getpay",
			},
		];

		const institutionPortalLink = process.env.INSTITUTION_PORTAL_LINK;

		const emailTemplateValues = {
			institutionName: institutionName,
			institutionLargeLogo: institutionLargeLogo,
			password: password,
			name: user.userName,
			portalLink: institutionPortalLink,
			showPoweredByLogo: showPoweredByLogo,
		};

		// Revoke Active Session On Password Reset
		this.userPoolService.revokeSession(
			user.userId,
			requestContext.getCurrentUser().institutionCode
		);

		await this.emailService.sendEmail({
			emailProperties: {
				subject: "Password change for user account",
				to: user.userId,
				templateName: "reset-password",
				replace: emailTemplateValues,
				attachments,
			},
			institutionCode: this.als.getStore()["currentUser"].institutionCode,
		});
	}
}
