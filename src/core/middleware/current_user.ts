export class CurrentUser {
	readonly loginId: string;
	readonly userId: string;
	readonly fullName: string;
	readonly institutionCode: string;
	readonly schema?: string;
	readonly username?: string; 
	readonly institutionType?: string[];
	requestedInstitutionType?: string;

	constructor(
		loginId: string,
		userId: string,
		fullName: string,
		institutionCode: string,
		schema?: string,
		username?:string,
		institutionType?: string[]
	) {
		this.loginId = loginId;
		this.userId = userId;
		this.fullName = fullName;
		this.institutionCode = institutionCode;
		this.schema = schema;
		this.username = username; 
		this.institutionType = institutionType;
	}
}
