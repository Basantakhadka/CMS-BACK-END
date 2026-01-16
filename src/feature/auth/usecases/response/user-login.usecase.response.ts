import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class UserLoginUsecaseResponse implements UsecaseResponse {
	constructor(public loginInfo: any) {}
}
