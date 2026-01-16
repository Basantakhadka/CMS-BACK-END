import { OtpRepository } from "CMS-BACK-END/src/core/otp/otp.repository";
import { Result } from "@app/feature/common/result";
import { otpConstantParameters } from "@app/feature/constants";
import { GeneralPolicyDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/general-policy.repository";
import { GeneralPolicyRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/general-policy.repository";
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import * as crypto from "crypto";
import { RequestContext } from "../middleware/request_context";
import { OtpDbRepository } from "./db/otp.repository";
import { OTP_OPERATION } from "./otp.dto";
import { Otp } from "./otp.entity";
import { VerifyOtpDto } from "./verify-otp.dto";

// function to add otp expiry time
function addOtpExpiryTime(
  currentTimeInMiliseconds: number = Date.now(),
  minutes: number
) {
  const addedTimeInMiliseconds = minutes * 60000;
  return currentTimeInMiliseconds + addedTimeInMiliseconds;
}

interface OtpRequestPayload {
  operationId: string;
  operationType: OTP_OPERATION;
  resend?: boolean;
}

@Injectable()
export class OtpService {
  constructor(
    @Inject(OtpDbRepository) private readonly otpRepository: OtpRepository,
    @Inject(GeneralPolicyDbRepository)
    private readonly generalPolicyRepository: GeneralPolicyRepository
  ) {}

  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(
    otpRequestPayload: OtpRequestPayload,
    requestContext: RequestContext
  ) {
    const setting = await this.generalPolicyRepository.findAll(
      requestContext.getCurrentUser().institutionCode
    );
    const { usersOtpSetting } = setting[0];
    const OTP_ENABLED = process.env.ENABLE_OTP_NOTIFICATION;
    const otp = new Otp();
    otp.operationId = otpRequestPayload.operationId.toLowerCase();
    otp.operationType = otpRequestPayload.operationType;

    const otpInfo = await this.otpRepository.find(
      otp,
      requestContext.getCurrentUser().institutionCode
    );

    let currentOtpRetryCount = otpInfo ? otpInfo.otpRetryCount : 0;
    let currentOtpSendCount = otpInfo?.otpSentCount || 0;
    if (!otpRequestPayload.resend) {
      currentOtpSendCount = otpInfo ? otpInfo?.otpSentCount + 1 : 1;
    }
    let OtpResendCount = 0;
    if (otpRequestPayload.resend) {
      OtpResendCount = otpInfo ? otpInfo?.otpResendCount + 1 : 0;
    }

    let timer = Date.now().toString();

    const currentTimeStamp = Date.now() / 60000;
    if (currentOtpSendCount > +usersOtpSetting.requestPerDay) {
      if (
        currentTimeStamp - +timer / 60000 >
        otpConstantParameters.OTP_FAILURE_RESET_TIME
      ) {
        currentOtpSendCount = 1;
        currentOtpRetryCount = 0;
      } else {
        throw new HttpException(
          `The maximum number of OTP attempts has been reached. Please try again later.`,
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
    }

    if (
      otpRequestPayload.resend &&
      OtpResendCount > +usersOtpSetting.resendLimit
    ) {
      throw new HttpException(
        `Too many resend attempts.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    otp.operationType = otpRequestPayload.operationType;
    otp.otpSentCount = currentOtpSendCount;
    otp.otpRetryCount = currentOtpRetryCount;
    otp.otpResendCount = OtpResendCount;
    otp.timer = timer;
    otp.expiryTime = addOtpExpiryTime(
      Date.now(),
      +usersOtpSetting.expiryTime
    ).toString();
    otp.blocked = false;

    if (OTP_ENABLED === "true") {
			otp.otpValue = this.generateOtp();
		} else {
			otp.otpValue = "101010";
		}

		// save otp request to database
		if (otpInfo) {
			await this.otpRepository.update(
				otp,
				requestContext.getCurrentUser().institutionCode
			);
		} else {
			await this.otpRepository.insert(
				otp,
				requestContext.getCurrentUser().institutionCode
			);
		}

    return {
      otpValue: otp.otpValue,
      resendInterval: usersOtpSetting.resendInterval,
      otpEnabled: OTP_ENABLED === "true",
    };
  }

  async verifyOtp(body: VerifyOtpDto, otp: Otp) {
    const payload = {
      operationId: otp.operationId,
      operationType: otp.operationType,
      otpValue: otp.otpValue,
    };
    const payloadString = JSON.stringify(payload);
    const hash = crypto.createHash("sha256");
    const otpHash = hash.update(payloadString).digest("hex");
    const currentTimeStamp = Date.now();

    if (body.otpValue !== otp?.otpValue) {
      Result.createErrorWithMessage(
        new BadRequestException(
          "Sorry, the OTP you entered is incorrect. Please try again."
        ),
        "Invalid Otp"
      );
    }
    if (currentTimeStamp > +otp?.expiryTime) {
      Result.createErrorWithMessage(
        new BadRequestException(
          "The OTP has expired. Please request a new one."
        ),
        "Otp Expired"
      );
    }
    return otpHash;
  }
}
