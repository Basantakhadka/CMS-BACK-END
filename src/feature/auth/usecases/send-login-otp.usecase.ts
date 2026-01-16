import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { OTP_OPERATION } from "CMS-BACK-END/src/core/otp/otp.dto";
import { OtpService } from "CMS-BACK-END/src/core/otp/otp.service";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { UserDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user.repository";
import { UserRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/user.repository";
import { IMailOptions } from "CMS-BACK-END/src/shared/mailer/mailer-interfaces";
import { Inject } from "@nestjs/common";
import * as path from "path";
import { AuthMessageProducer } from "../producers/auth-message.producer";
import { SendLoginOtpUsecaseRequest } from "./request/send-login-otp.usecase.request";
import { SendLoginOtpUsecaseResponse } from "./response/send-login-otp.usecase.response";
import { SystemConfigurationDbRepository } from "@app/feature/system-configuration/repositories/db/system-configuration.repository";
import { SystemConfigurationRepository } from "@app/feature/system-configuration/repositories/system-configuration.repository";
import { EmailService } from "CMS-BACK-END/src/core/notification/notification.service";
export class SendLoginOtpUsecase
	implements Usecase<SendLoginOtpUsecaseRequest, SendLoginOtpUsecaseResponse>
{
	constructor(
		@Inject(OtpService) private readonly otpService: OtpService,
		@Inject(UserDbRepository)
		private readonly userRepository: UserRepository,
		@Inject(AuthMessageProducer)
		private readonly authMessageProducer: AuthMessageProducer,
		@Inject(SystemConfigurationDbRepository)
		private readonly systemConfigurationRepository?: SystemConfigurationRepository,
		@Inject(EmailService)
		private readonly emailService?: EmailService
	) {}
	async execute(
		request: SendLoginOtpUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<SendLoginOtpUsecaseResponse>> {
		const { resendInterval, otpEnabled, otpValue } =
			await this.otpService.sendOtp(
				{
					operationId: request.body.operationId,
					operationType: request.body.operationType,
					resend: !!request.body?.resend,
				},
				requestContext
			);
		
		const operatorsInfo = await this.systemConfigurationRepository.findAll();
		const operatorInfo = operatorsInfo[0];
		const configKey = JSON.parse(operatorInfo?.configKey);
		const institutionLogo = configKey?.institutionLargeLogo;

		await this.sendEmail(
			request,
			requestContext,
			requestContext.getCurrentUser().fullName,
			otpValue,
			otpEnabled,
			institutionLogo
		);
		const response = new SendLoginOtpUsecaseResponse(+resendInterval, true);
		return Result.createSuccess(response);
	}

	private async sendEmail(
		request: SendLoginOtpUsecaseRequest,
		requestContext: RequestContext,
		userName: string,
		otpValue: string,
		otpEnabled: boolean,
		institutionLargeLogo?: string
	) {

		if (otpEnabled && request.body.operationType == OTP_OPERATION.VERIFY_2FA) {
			const mailConfigOptions: IMailOptions = {
				subject: "Login Verification Code",
				to: request.body.operationId,
				templateName: "login-verification",
				replace: {
					userName,
					otpValue,
					institutionLargeLogo,
				},
				attachments: [],
			};
			const message = {
				emailProperties: mailConfigOptions,
				institutionCode: requestContext.getCurrentUser().institutionCode,
			};
			await this.emailService.sendEmail(message);

		}
	}
}
