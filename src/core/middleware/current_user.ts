export class CurrentUser {
	readonly loginId: string;
	readonly userId: string;
	readonly fullName: string;
	readonly schema?: string;
	readonly username?: string;
	readonly clientCode?: string;


	constructor(
		loginId: string,
		userId: string,
		fullName: string,
		schema?: string,
		username?:string,
		clientCode?: string,
	) {
		this.loginId = loginId;
		this.userId = userId;
		this.fullName = fullName;
		this.schema = schema;
		this.clientCode = clientCode;
		this.username = username; 

	}
}
