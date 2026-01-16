import { OtpDto } from "CMS-BACK-END/src/core/otp/otp.dto";
import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class SendLoginOtpUsecaseRequest implements UsecaseRequest {
	constructor(public body: OtpDto) {}
}
