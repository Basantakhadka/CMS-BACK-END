import { EnumType } from "./enum-type.constant";

export class PaymentAcceptingGroupType extends EnumType<PaymentAcceptingGroupType> {
	public static readonly POS = new PaymentAcceptingGroupType("POS", "POS");
	public static readonly QR_STANDEE = new PaymentAcceptingGroupType(
		"QR_STANDEE",
		"QR STANDEE"
	);
	public static readonly WEB_CHECKOUT = new PaymentAcceptingGroupType(
		"WEB_CHECKOUT",
		"WEB CHECKOUT"
	);
	public static readonly QR = new PaymentAcceptingGroupType("QR", "QR");
	public static readonly MNO = new PaymentAcceptingGroupType("MNO", "MNO");
	public static readonly PREPAID_CARD = new PaymentAcceptingGroupType("PREPAID_CARD", "Pre-paid Card");

	public static readonly MOBILE_MONEY = new PaymentAcceptingGroupType(
		"MOBILE_MONEY",
		"Mobile Money"
	);

	private constructor(
		public readonly name: string,
		public readonly displayName: string
	) {
		super(name);
		this.displayName = displayName;
	}

	public static getValues(): PaymentAcceptingGroupType[] {
		return [this.POS, this.QR_STANDEE, this.WEB_CHECKOUT, this.QR, this.MNO,this.MOBILE_MONEY,this.PREPAID_CARD];
	}

	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
}
