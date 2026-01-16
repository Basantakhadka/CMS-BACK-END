import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
} from "class-validator";
import { OTP_OPERATION } from "./otp.dto";

export class VerifyOtpDto {
	@IsNotEmpty()
	@IsString()
	operationId: string;
	@IsNotEmpty()
	@IsEnum(OTP_OPERATION, { each: true })
	operationType: OTP_OPERATION;
	@IsString()
	@IsOptional()
	@Length(6, 6, { message: "otp value must be 6 digits" })
	otpValue?: string;
	expiryTime?: string;
	@IsString()
	@IsOptional()
	merchantName?: string;
}
