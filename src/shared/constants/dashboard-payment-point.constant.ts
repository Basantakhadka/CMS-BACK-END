import { EnumType } from "./enum-type.constant";
import { PaymentPoints } from "./payment-points.constant";

export class DashboardPaymentPoint extends EnumType<PaymentPoints> {
	public static readonly QR = new DashboardPaymentPoint(
		PaymentPoints.QR.name,
		"QR",
		[PaymentPoints.QR.name]
	);
	public static readonly POS = new DashboardPaymentPoint(
		PaymentPoints.POS.name,
		"POS",
		[PaymentPoints.POS.name]
	);
	public static readonly WEB_CHECKOUT = new DashboardPaymentPoint(
		"WEB_CHECKOUT",
		"Web Checkout",
		[PaymentPoints.WEB_CHECKOUT.name]
	);
	public static readonly NFC = new DashboardPaymentPoint('NFC', 'NFC', [PaymentPoints.POS.name]);
	public static readonly CARD = new DashboardPaymentPoint("CARD", "Card", [PaymentPoints.POS.name]);

	private constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly transactionPAP: Array<string>
	) {
		super(name);
		this.displayName = displayName;
		this.transactionPAP = transactionPAP;
	}

	public static getValues(): DashboardPaymentPoint[] {
		return [this.QR, this.POS, this.WEB_CHECKOUT, this.CARD, this.NFC];
	}

	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
}
