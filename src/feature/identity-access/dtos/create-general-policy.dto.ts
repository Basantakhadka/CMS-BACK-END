import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { CustomMaximumPasswordLengthValidator } from "./custom-maximum-password-length-validator";
import { CustomMinimumPasswordLengthValidator } from "./custom-minimum-password-length-validator";

export class PasswordHistory {
  @IsNotEmpty()
  @IsBoolean()
  active: boolean = true;

  @ValidateIf((field: PasswordHistory) => field.active === true, {
    message: "Limits cannot be set when unsuccessful login is disabled",
  })
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: "Password history limits must be valid number",
  })
  limits: string = "0";
}

export class MFAOtp {
  @IsNotEmpty()
  @IsBoolean()
  active: boolean = true;

  @IsOptional()
  channels: string = null;
}

export class MultiFactorAuthentication {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => MFAOtp)
  otp: MFAOtp = new MFAOtp();
}

export class PasswordExpiry {
  @IsNotEmpty()
  @IsBoolean()
  neverExpires: boolean = false;

  @ValidateIf((field: PasswordExpiry) => field.neverExpires === false, {
    message: "limits cannot be set when password never expires is true",
  })
  @Matches(/^[0-9]+$/, {
    message: "Password expiry limits must be valid number",
  })
  @IsNotEmpty()
  limits: string = "0";

  @IsOptional()
  @IsString()
  units: string = "perDay";
}

export class FailedLoginAttempt {
  @IsNotEmpty()
  @IsBoolean()
  active: boolean = true;

  @ValidateIf((field: FailedLoginAttempt) => field.active === true, {
    message: "Limits cannot be set when unsuccessful login is disabled",
  })
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: "Failed login attempt limits must be valid number",
  })
  limits: string = "0";

  @ValidateIf((field: FailedLoginAttempt) => field.active === true, {
    message:
      "Lock User Count cannot be set when unsuccessful login is disabled",
  })
  @IsNotEmpty()
  @IsString()
  lockUserCount: string = "perDay";
}

export class OTPSetting {
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: "Number of OTP per user per day must be valid number",
  })
  requestPerDay: string = "0";
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: "OTP expiry time must be valid number",
  })
  expiryTime: string = "0";
  @IsNotEmpty()
  @Matches(/^[0-9]+(\.[0-9]+)?$/, {
    message: "Resend request limit must be valid number",
  })
  resendLimit: string = "0";

  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: "Interval between two OTPS must be valid number",
  })
  resendInterval: string = "0";
}
export class PasswordPolicy {
  @IsNotEmpty()
  @Matches(/^[0-9]+(\.[0-9]+)?$/, {
    message: "Minimum length must be valid number",
  })
  @Validate(CustomMinimumPasswordLengthValidator)
  minimumLength: string = "0";

  @ValidateIf((field, value) => value !== "" || value)
  @Matches(/^[0-9]+$/, {
    message: "Maximum length must be valid number",
  })
  @Validate(CustomMaximumPasswordLengthValidator)
  maximumLength: string = "0";

  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: "Minimum uppercase must be valid number",
  })
  minimumUppercase: string = "0";

  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: "Minimum numbers must be valid number",
  })
  minimumNumbers: string = "0";

  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: "Minimum special characters must be valid number",
  })
  minimumSpecialCharacters: string = "0";

  @IsNotEmpty()
  @IsBoolean()
  dissimilarToUserId: boolean = true;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PasswordHistory)
  passwordHistory: PasswordHistory = new PasswordHistory();

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => FailedLoginAttempt)
  failedLoginAttempts: FailedLoginAttempt = new FailedLoginAttempt();

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PasswordExpiry)
  passwordExpiry: PasswordExpiry = new PasswordExpiry();

  shouldSendEmailOnFailedLogin: boolean = false;
}

export class CreateGeneralPolicyDto {
  @IsNotEmpty()
  active: boolean;
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => MultiFactorAuthentication)
  usersMfa: MultiFactorAuthentication;
  @Type(() => MultiFactorAuthentication)
  merchantsMfa: MultiFactorAuthentication;
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PasswordPolicy)
  passwordPolicy: PasswordPolicy;
  @ValidateNested()
  @IsOptional()
  @Type(() => OTPSetting)
  merchantsOtpSetting: OTPSetting;
  @IsOptional()
  @ValidateNested()
  @Type(() => OTPSetting)
  usersOtpSetting: OTPSetting;
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => OTPSetting)
  merchantSignupOtpSetting: OTPSetting;
}
