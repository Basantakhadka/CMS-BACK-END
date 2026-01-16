import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class UserLogoutUsecaseResponse implements UsecaseResponse {
	constructor(public success: boolean) {}
}