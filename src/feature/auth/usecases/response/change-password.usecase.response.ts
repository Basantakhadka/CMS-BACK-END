import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class ChangePasswordUsecaseResponse implements UsecaseResponse {
	constructor(public success: boolean, public message: string) {}
}
