import { EnumType } from "./enum-type.constant";
export class PaymentTypeConstant extends EnumType<PaymentTypeConstant> {
	static readonly QR_DYNAMIC = new PaymentTypeConstant(
		"QR_DYNAMIC",
		"Dynamic QR"
	);
	static readonly CARD = new PaymentTypeConstant(
		"CARD",
		"Card"
	);
	static readonly QR_STATIC = new PaymentTypeConstant("QR_STATIC", "Static QR");
	static readonly NFC = new PaymentTypeConstant("NFC", "NFC");
	static readonly MOBILE_NFC = new PaymentTypeConstant(
		"MOBILE_NFC",
		"Mobile NFC"
	);
	static readonly CARD_NFC = new PaymentTypeConstant(
		"CARD_NFC",
		"Contact less Card"
	);
	static readonly CARD_MAG = new PaymentTypeConstant("CARD_MAG", "Swipe Card");
	static readonly CARD_CHIP = new PaymentTypeConstant("CARD_CHIP", "Chip Card");
	static readonly CARD_MANUAL = new PaymentTypeConstant(
		"CARD_MANUAL",
		"Manual Card"
	);
	static readonly USSD_PUSH = new PaymentTypeConstant("USSD_PUSH", "USSD Push");
	static readonly CASH = new PaymentTypeConstant("CASH", "Cash");
	static readonly PREPAID_CARD = new PaymentTypeConstant("PREPAID_CARD", "Pre-paid Card");

	private constructor(
		public readonly name: string,
		public readonly displayName: string
	) {
		super(name);
		this.displayName = displayName;
	}
	public static getValues(): PaymentTypeConstant[] {
		return [
			this.QR_DYNAMIC,
			this.QR_STATIC,
			this.NFC,
			this.CARD_NFC,
			this.CARD_MAG,
			this.CARD_CHIP,
			this.CARD_MANUAL,
			this.MOBILE_NFC,
			this.USSD_PUSH,
			this.CASH,
			this.CARD,
			this.PREPAID_CARD
		];
	}
	public static getByName(name: string) {
		if (!name) {
			return null;
		}
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
	public static getByMultipleNames(names: string[]) {
		if (!names || names.length === 0) {
			return [];
		}
		let results = this.getValues().filter((item) => names.includes(item.name));
		return results.map((item) => item.displayName);
	}
}
