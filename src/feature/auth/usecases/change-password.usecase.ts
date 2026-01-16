import { comparePassword, hashPassword } from "CMS-BACK-END/src/core/hashing/hashing";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { GeneralPolicy } from "CMS-BACK-END/src/feature/identity-access/entities/general-policy.entity";
import { UserCredential } from "CMS-BACK-END/src/feature/identity-access/entities/user-credential.entity";
import { User } from "CMS-BACK-END/src/feature/identity-access/entities/user.entity";
import { GeneralPolicyDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/general-policy.repository";
import { UserCredentialDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user-credential.repository";
import { UserDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user.repository";
import { GeneralPolicyRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/general-policy.repository";
import { UserCredentialRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/user-credential.repository";
import { UserRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/user.repository";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";
import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { ChangePasswordUsecaseRequest } from "./request/change-password.usecase.request";
import { ChangePasswordUsecaseResponse } from "./response/change-password.usecase.response";
import { UserPoolService } from "CMS-BACK-END/src/core/cache/user-pool.service";
import { OtpDbRepository } from "CMS-BACK-END/src/core/otp/db/otp.repository";
import { OtpRepository } from "CMS-BACK-END/src/core/otp/otp.repository";
import { OTP_OPERATION } from "CMS-BACK-END/src/core/otp/otp.dto";
import { OtpService } from "CMS-BACK-END/src/core/otp/otp.service";

export class changePasswordUsecase
	implements
		Usecase<ChangePasswordUsecaseRequest, ChangePasswordUsecaseResponse>
{
	constructor(
		@Inject(UserCredentialDbRepository)
		private readonly userCredentialRepository: UserCredentialRepository,
		@Inject(UserDbRepository) private readonly userRepository: UserRepository,
		@Inject(GeneralPolicyDbRepository)
		private readonly generalPolicyRepository: GeneralPolicyRepository,
		@Inject(UserPoolService) private userPoolService: UserPoolService,
		@Inject(OtpDbRepository) private otpRepository: OtpRepository,
		@Inject(OtpService) private otpService: OtpService
	) {}
	private passwordExpiresIn(days: string): string {
		const millisecondsPerDay = 24 * 60 * 60 * 1000;
		const currentDate = new Date();
		const timestamp = currentDate.getTime() + +days * millisecondsPerDay;
		return timestamp.toString();
	}

	private async validatePasswordPolicy(
		password: string,
		hashedPassword: string,
		generalPolicy: GeneralPolicy[],
		userCredential: UserCredential,
		user: User
	) {
		const { userId, userName, id } = user;
		const passwordPolicy = generalPolicy[0].passwordPolicy;

		const dissimilarToUserId = passwordPolicy.dissimilarToUserId;
		if (dissimilarToUserId) {
			if (userId.includes(password) || userName.includes(password)) {
				Result.createError(
					new BadRequestException(
						"Password should not be similar to userId or username"
					)
				);
			}
		}
		const doPasswordExpire = !passwordPolicy.passwordExpiry.neverExpires;
		const passwordExpiryDays = passwordPolicy.passwordExpiry.limits;
		const passwordHistory = [];
		const isPasswordHistoryActive = passwordPolicy.passwordHistory.active;
		const passwordLimits = +passwordPolicy.passwordHistory.limits;
		const passwordHistoryList = userCredential.passwordHistory || [];
		if (isPasswordHistoryActive) {
			for (let i = 0; i < passwordLimits; i++) {
				if (!passwordHistory || passwordHistoryList.length === 0) {
					break;
				}
				if (
					await comparePassword(password, passwordHistoryList[i], id, userId)
				) {
					Result.createError(
						new BadRequestException(
							`Sorry, you cannot use any of your previous ${passwordLimits} passwords as your new password. Please choose a different one.`
						)
					);
				}
			}
		}
		passwordHistoryList.unshift(hashedPassword);
		const expiryTime = doPasswordExpire
			? this.passwordExpiresIn(passwordExpiryDays)
			: null;
		return { passwordHistory: passwordHistoryList, expiryTime };
	}
	async execute(
		request: ChangePasswordUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<ChangePasswordUsecaseResponse>> {
		const id = requestContext.getCurrentUser().loginId;
		const user = await this.userRepository.findById(id);
		const newSetup = !!request.otp?.length;

		if (!user) {
			Result.createError(new BadRequestException("User not found"));
		}
		const { password, confirmPassword } = request;
		if (password !== confirmPassword) {
			Result.createError(new BadRequestException("Password do not match"));
		}
		if (newSetup) {
			const username = request.username?.toLowerCase();
			if (!username) {
				return Result.createError(
					new BadRequestException("Username is required")
				);
			}
			const otp = await this.otpRepository.findOtp(
				username,
				OTP_OPERATION.VERIFY_2FA,
				requestContext["currentUser"].institutionCode
			);
			if (!otp) {
				return Result.createError(
					new NotFoundException("Otp with requested id not found")
				);
			}
			await this.otpService.verifyOtp(
				{
					operationId: username,
					operationType: OTP_OPERATION.VERIFY_2FA,
					otpValue: request.otp,
				},
				otp
			);
		}
		const userCredential = await this.userCredentialRepository.findById(id);
		if (
			!newSetup &&
			request.oldPassword &&
			!(await comparePassword(
				request?.oldPassword,
				userCredential.password,
				id,
				user.userId
			))
		) {
			return Result.createError(
				new BadRequestException("Current Password is incorrect!")
			);
		}
		const generalPolicy = await this.generalPolicyRepository.findAll();
		const hashedPassword = await hashPassword(
			request.password,
			id,
			user.userId
		);

		const result = await this.validatePasswordPolicy(
			password,
			hashedPassword,
			generalPolicy,
			userCredential,
			user
		);
		await this.userCredentialRepository.update({
			id,
			enforcePasswordChange: false,
			password: hashedPassword,
			passwordHistory: result.passwordHistory,
			expiryTime: result.expiryTime,
			version: IdGenerator.generateId("4"),
		});
		const response = new ChangePasswordUsecaseResponse(
			true,
			"Password changed successfully."
		);
		this.userPoolService.revokeSession(
			requestContext.getCurrentUser().userId,
			requestContext.getCurrentUser().institutionCode
		);
		return Result.createSuccess(response);
	}
}
