import { EnumType } from "./enum-type.constant";
import { PaymentMode } from "./payment-mode.constant";

export class IssuerDashboardPaymentModeConstant extends EnumType<IssuerDashboardPaymentModeConstant> {
	public static readonly QR_STATIC = new IssuerDashboardPaymentModeConstant(
		PaymentMode.QR_STATIC.value,
		"Static QR",
		[PaymentMode.QR_STATIC.value],
		"#0098A1"
	);
	public static readonly QR_DYNAMIC = new IssuerDashboardPaymentModeConstant(
		PaymentMode.QR_DYNAMIC.value,
		"Dynamic QR",
		[PaymentMode.QR_DYNAMIC.value],
		"#272684"
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

	public static getValues(): IssuerDashboardPaymentModeConstant[] {
		return [
			this.QR_STATIC,
			this.QR_DYNAMIC
		];
	}
	public static getPaymentModes(): string[] {
		return [
			this.QR_STATIC.name,
			this.QR_DYNAMIC.name
		];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
	public static getPaymentModeNameByPaymentMode(mode: string) {
		return this.getValues().filter((genericMode: IssuerDashboardPaymentModeConstant) =>
			genericMode.transactionPAP.includes(mode)
		);
	}
}
