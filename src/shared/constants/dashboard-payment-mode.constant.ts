import {EnumType} from "./enum-type.constant";
import {PaymentMode} from "CMS-BACK-END/src/shared/constants/payment-mode.constant";

export class DashboardPaymentModeConstant extends EnumType<DashboardPaymentModeConstant> {
	public static readonly QR = new DashboardPaymentModeConstant(
		PaymentMode.QR.value,
		"QR",
		[PaymentMode.QR.value],
		"#0098A1"
	);
	public static readonly CARD = new DashboardPaymentModeConstant(
		PaymentMode.CARD.value,
		"Card",
		[PaymentMode.CARD.value],
		"#272684"
	);
	public static readonly WEB_CHECKOUT = new DashboardPaymentModeConstant(
		"WEB_CHECKOUT",
		"Web checkout",
		[PaymentMode.QR.value],
		"#FBCE2F"
	);
	public static readonly NFC = new DashboardPaymentModeConstant(
		"NFC",
		"NFC",
		[PaymentMode.NFC.value],
		"#FF8642"
	);

	private constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly transactionPAP: Array<string>,
		public readonly legendColor: string
	) {
		super(name);
		this.displayName = displayName;
		this.transactionPAP = transactionPAP;
		this.legendColor = legendColor;
	}

	public static getValues(): DashboardPaymentModeConstant[] {
		return [this.QR, this.CARD, this.WEB_CHECKOUT, this.NFC];
	}

	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
}
