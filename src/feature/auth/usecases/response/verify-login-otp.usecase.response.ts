import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class VerifyLoginOtpUsecaseResponse implements UsecaseResponse {
	constructor(public otpHash: string, public loginInfo: any) {}
}
