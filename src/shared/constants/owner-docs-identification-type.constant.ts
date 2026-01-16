import { EnumType } from "./enum-type.constant";

export class OwnerDocsIdentificationType extends EnumType<OwnerDocsIdentificationType> {
	public static readonly CITIZENSHIP = new OwnerDocsIdentificationType(
		"CITIZENSHIP",
		"Citizenship"
	);
	public static readonly NATIONAL_ID = new OwnerDocsIdentificationType(
		"NATIONAL_ID",
		"National ID"
	);
	public static readonly PASSPORT = new OwnerDocsIdentificationType(
		"PASSPORT",
		"Passport"
	);
	public static readonly DRIVING_LICENSE = new OwnerDocsIdentificationType(
		"DRIVING_LICENSE",
		"Driving License"
	);
	public static readonly NATIONAL_IDENTITY_CARD =
		new OwnerDocsIdentificationType(
			"NATIONAL_IDENTITY_CARD",
			"National Identity Card"
		);
	public static readonly VOTERS_REGISTRATION_CARD =
		new OwnerDocsIdentificationType(
			"VOTERS_REGISTRATION_CARD",
			"Voters Registration Card"
		);
	public static readonly WARD_IDENTIY_CARD = new OwnerDocsIdentificationType(
		"WARD_IDENTIY_CARD",
		"Ward Identity Card"
	);
	public static readonly WORK_PERMIT = new OwnerDocsIdentificationType(
		"WORK_PERMIT",
		"Work Permit"
	);
	public static readonly ZANZIBAR_IDENTIY_CARD =
		new OwnerDocsIdentificationType(
			"ZANZIBAR_IDENTIY_CARD",
			"Zanzibar Identity Card"
		);
	constructor(
		public readonly name: string,
		public readonly displayname: string
	) {
		super(name);
		this.displayname = displayname;
	}

	public static getValues(): OwnerDocsIdentificationType[] {
		return [
			this.CITIZENSHIP,
			this.NATIONAL_ID,
			this.PASSPORT,
			this.DRIVING_LICENSE,
			this.NATIONAL_IDENTITY_CARD,
			this.VOTERS_REGISTRATION_CARD,
			this.WORK_PERMIT,
			this.ZANZIBAR_IDENTIY_CARD,
			this.WARD_IDENTIY_CARD,
		];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
}