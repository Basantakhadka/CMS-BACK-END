import { VerifyOtpDto } from "CMS-BACK-END/src/core/otp/verify-otp.dto";
import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class VerifyLoginOtpUsecaseRequest implements UsecaseRequest {
	constructor(public body: VerifyOtpDto) {}
}
