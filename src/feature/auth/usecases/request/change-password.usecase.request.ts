import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class ChangePasswordUsecaseRequest implements UsecaseRequest {
	constructor(
		public password: string,
		public confirmPassword: string,
		public oldPassword?: string,
		public otp?: string,
		public username?: string
	) {}
}
