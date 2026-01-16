import { EnumType } from "./enum-type.constant";

export class InstitutionCodePrefixType extends EnumType<InstitutionCodePrefixType> {
	public static readonly PREFIX = new InstitutionCodePrefixType(
		"institution",
		"institution"
	);
	private static dbGroupName = process.env.DB_GROUP_NAME
		? process.env.DB_GROUP_NAME + "_"
		: "";

	private constructor(
		public readonly name: string,
		public readonly displayName: string
	) {
		super(name);
		this.displayName = displayName;
	}

	public static getValues(): InstitutionCodePrefixType[] {
		return [this.PREFIX];
	}

	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}

	public static getSchema(institutionCode: string) {
		if (institutionCode) {
			const keyspace = `${this.dbGroupName}${this.PREFIX.displayName}_${institutionCode}`;
			return keyspace.toLowerCase();
		} else {
			return null;
		}
	}
}
