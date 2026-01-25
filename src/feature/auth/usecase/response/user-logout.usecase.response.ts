import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class UserLogoutUsecaseResponse implements UsecaseResponse {
	constructor(public success: boolean) {}
}