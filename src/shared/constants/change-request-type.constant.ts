import { EnumType } from "./enum-type.constant";

export class ChangeRequestType extends EnumType<ChangeRequestType> {
	public static readonly ADD = new ChangeRequestType("ADD", "Add");
	public static readonly UPDATE = new ChangeRequestType("UPDATE", "Edit");
	public static readonly DELETE = new ChangeRequestType("DELETE", "Delete");
	public static readonly SYSTEM_UPDATED = new ChangeRequestType(
		"SYSTEM_UPDATED",
		"System Update"
	);
	public static readonly REQUEST_FOR_CHANGE = new ChangeRequestType(
		"REQUEST_FOR_CHANGE",
		"Request for Change"
	);
	public static readonly IN_APPROVAL = new ChangeRequestType(
		"IN_APPROVAL",
		"In Approval"
	);

	constructor(
		public readonly name: string,
		public readonly displayname: string
	) {
		super(name);
		this.displayname = displayname;
	}

	public static getValues(): ChangeRequestType[] {
		return [
			this.ADD,
			this.UPDATE,
			this.DELETE,
			this.SYSTEM_UPDATED,
			this.REQUEST_FOR_CHANGE,
			this.IN_APPROVAL,
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