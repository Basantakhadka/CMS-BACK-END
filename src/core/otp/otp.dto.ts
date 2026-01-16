import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Matches,
} from "class-validator";

export enum OTP_OPERATION {
	REGISTER = "REGISTER",
	VERIFY = "VERIFY",
	VERIFY_2FA = "VERIFY_2FA",
}

export class OtpDto {
	@IsNotEmpty()
	@IsString()
	operationId: string;
	@IsNotEmpty()
	@IsEnum(OTP_OPERATION, { each: true })
	operationType: OTP_OPERATION;
	@IsOptional()
	@IsBoolean()
	resend?: boolean;
	@IsString()
	@IsOptional()
	@Length(6, 6, { message: "otp value must be 6 digits" })
	otpValue?: string;
	@IsNumber()
	@IsOptional()
	otpSentCount?: number;
	@IsNumber()
	@IsOptional()
	otpRetryCount?: number;
	timer?: string;
	@IsOptional()
	@IsBoolean()
	blocked?: boolean;
	expiryTime?: string;
}
