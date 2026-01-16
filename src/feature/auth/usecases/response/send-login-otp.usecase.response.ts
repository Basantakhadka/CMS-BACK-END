import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class SendLoginOtpUsecaseResponse implements UsecaseResponse {
	constructor(public resendInterval: number, public success: boolean) {}
}
