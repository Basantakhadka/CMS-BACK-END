import { OTP_OPERATION } from "./otp.dto";
import { Otp } from "./otp.entity";

export interface OtpRepository {
	find(otp: Otp, institutionCode: string): Promise<Otp>;
	insert(otp: Otp, institutionCode: string): Promise<Otp>;
	update(otp: Otp, institutionCode: string): Promise<Partial<Otp>>;
	findOtp(
		operationId: string,
		operationType: OTP_OPERATION,
		institutionCode: string
	): Promise<Otp>;
}
