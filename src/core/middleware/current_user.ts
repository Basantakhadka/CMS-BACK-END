export class CurrentUser {
	readonly loginId: string;
	readonly userId: string;
	readonly fullName: string;
	readonly schema?: string;
	readonly username?: string; 

	constructor(
		loginId: string,
		userId: string,
		fullName: string,
		schema?: string,
		username?:string,

	) {
		this.loginId = loginId;
		this.userId = userId;
		this.fullName = fullName;
		this.schema = schema;
		this.username = username; 

	}
}
