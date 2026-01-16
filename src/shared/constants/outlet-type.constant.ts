import { EnumType } from "./enum-type.constant";
import { PaymentPoints } from "./payment-points.constant";

export class OutletType extends EnumType<OutletType> {
	public static readonly ONLINE_STORE = new OutletType(
		"ONLINE_STORE",
		"Online Store",
		[PaymentPoints.PAYMENT_LINK, PaymentPoints.WEB_CHECKOUT]
	);
	public static readonly PHYSICAL_STORE = new OutletType(
		"PHYSICAL_STORE",
		"Offline Store",
		[PaymentPoints.POS, PaymentPoints.QR_STANDEE]
	);

	private constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly paymentPoints: PaymentPoints[]
	) {
		super(name);
		this.displayName = displayName;
	}

	public static getValues(): OutletType[] {
		return [this.ONLINE_STORE, this.PHYSICAL_STORE];
	}
	public static getOutletTypeStore(
		paymentAcceptingPoints: Array<PaymentPoints>
	): Map<string, PaymentPoints[]> {
		let resultMap: Map<string, PaymentPoints[]> = new Map<
			string,
			PaymentPoints[]
		>();

		paymentAcceptingPoints.forEach((pp) => {
			let outletType = this.getByPaymentPoint(pp);
			if (outletType) {
				let pps: PaymentPoints[] = [];
				if (resultMap.has(outletType.name)) {
					pps = resultMap.get(outletType.name);
				}
				pps.push(pp);
				resultMap.set(outletType.name, pps);
			}
		});

		return resultMap;
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}

	public static getByPaymentPoint(paymentPoint: PaymentPoints): OutletType {
		let results = this.getValues().filter((item) =>
			item.paymentPoints.includes(paymentPoint)
		);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
}
