import { EnumType } from "./enum-type.constant";
import { PaymentMode } from "./payment-mode.constant";

export class IssuerDashboardPaymentPoint extends EnumType<PaymentMode> {
	public static readonly CARD = new IssuerDashboardPaymentPoint(
		"CARD",
		"Card",
		[
			PaymentMode.CARD_CHIP.value,
			PaymentMode.CARD_MAG.value,
			PaymentMode.CARD_MANUAL.value,
			PaymentMode.CONTACT_LESS.value,
		]
	);
	public static readonly QR = new IssuerDashboardPaymentPoint(
		"QR_STANDEE",
		"Qr",
		[PaymentMode.QR_DYNAMIC.value, PaymentMode.QR_STATIC.value]
	);
	public static readonly TAPANDPAY = new IssuerDashboardPaymentPoint(
		"TAPANDPAY",
		"Tap & Pay",
		[PaymentMode.MOBILE_NFC.value]
	);

	private constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly transactionPAP: Array<string>
	) {
		super(name);
		this.displayName = displayName;
		this.transactionPAP = transactionPAP;
	}

	public static getValues(): IssuerDashboardPaymentPoint[] {
		return [this.QR, this.CARD, this.TAPANDPAY];
	}
	public static getPaymentModes(): string[] {
		return [this.QR.name, this.CARD.name, this.TAPANDPAY.name];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
	public static getPaymentModeNameByPaymentMode(mode: string) {
		return this.getValues().filter((genericMode: IssuerDashboardPaymentPoint) =>
			genericMode.transactionPAP.includes(mode)
		);
	}
}
