import { EnumType } from "./enum-type.constant";

export class FinalDisputeStatus extends EnumType<FinalDisputeStatus> {
	public static readonly AGREED_BY_MERCHANT = new FinalDisputeStatus(
		"AGREED_BY_MERCHANT",
		"Agreed by Merchant"
	);
	public static readonly AGREED_BY_CUSTOMER = new FinalDisputeStatus(
		"AGREED_BY_CUSTOMER",
		"Agreed by Customer"
	);
	public static readonly NETWORK_DECISION = new FinalDisputeStatus(
		"NETWORK_DECISION",
		"Network Decision"
	);

	constructor(
		public readonly name: string,
		public readonly displayName: string
	) {
		super(name);
		this.displayName = displayName;
	}
	public static getValues(): FinalDisputeStatus[] {
		return [
			this.AGREED_BY_MERCHANT,
			this.AGREED_BY_CUSTOMER,
			this.NETWORK_DECISION,
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
