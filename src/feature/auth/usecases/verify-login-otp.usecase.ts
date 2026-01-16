import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { VerifyLoginOtpUsecaseRequest } from "./request/verify-login-otp.usecase.request";
import { VerifyLoginOtpUsecaseResponse } from "./response/verify-login-otp.usecase.response";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Result } from "@app/feature/common/result";
import { OtpService } from "CMS-BACK-END/src/core/otp/otp.service";
import { OtpDbRepository } from "CMS-BACK-END/src/core/otp/db/otp.repository";
import { OtpRepository } from "CMS-BACK-END/src/core/otp/otp.repository";
import { Inject, NotFoundException } from "@nestjs/common";
import { UserPoolService } from "CMS-BACK-END/src/core/cache/user-pool.service";
import { UserDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user.repository";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";
import { UserLoginService } from "../services/user-login.service";
import { UserCredentialDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user-credential.repository";
import { MFASTATUS } from "@app/feature/constants";

export class VerifyLoginOtpUsecase
	implements
		Usecase<VerifyLoginOtpUsecaseRequest, VerifyLoginOtpUsecaseResponse>
{
	constructor(
		@Inject(OtpService)
		private readonly otpService: OtpService,
		@Inject(OtpDbRepository) private readonly otpRepository: OtpRepository,
		@Inject(UserDbRepository)
		private readonly userRepository: UserDbRepository,
		private readonly userLoginService: UserLoginService,
		private readonly userCredentialRepository: UserCredentialDbRepository
	) {}
	async execute(
		request: VerifyLoginOtpUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<VerifyLoginOtpUsecaseResponse>> {
		const otp = await this.otpRepository.findOtp(
			request.body.operationId.toLowerCase(),
			request.body.operationType,
			requestContext["currentUser"].institutionCode
		);
		if (!otp) {
			return Result.createError(
				new NotFoundException("Otp with requested id not found")
			);
		}
		const otpHash = await this.otpService.verifyOtp(request.body, otp);
		const user = await this.userRepository.findByUserId(
			request.body.operationId.toLowerCase()
		);
		if (!user) {
			return Result.createError(new NotFoundException("User not found"));
		}
		const userCredential = await this.userCredentialRepository.findById(
			user.id
		);
		const loginResponse = await this.userLoginService.execute(
			user,
			userCredential,
			requestContext,
			false,
			MFASTATUS.VERIFIED
		);
		const response = new VerifyLoginOtpUsecaseResponse(otpHash, loginResponse);
		return Result.createSuccess(response);
	}
}
