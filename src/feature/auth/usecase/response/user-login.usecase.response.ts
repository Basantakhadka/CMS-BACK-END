import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class UserLoginUsecaseResponse implements UsecaseResponse {
	constructor(public loginInfo: any) {}
}
