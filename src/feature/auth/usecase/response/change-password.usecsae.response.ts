import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class ChangePasswordUsecaseResponse implements UsecaseResponse {
	constructor(public success: boolean, public message: string) {}
}
