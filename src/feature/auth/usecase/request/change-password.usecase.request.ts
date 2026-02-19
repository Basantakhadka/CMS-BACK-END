import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class ChangePasswordUsecaseRequest implements UsecaseRequest {
	constructor(
		public password: string,
		public confirmPassword: string,
		public oldPassword?: string,
		public username?: string
	) {}
}
