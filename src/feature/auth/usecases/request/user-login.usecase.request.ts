import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class UserLoginUsecaseRequest implements UsecaseRequest {
	constructor(public username: string, public password: string) {}
}
