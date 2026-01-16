import { EnumType } from "./enum-type.constant";

export class PaymentGroup extends EnumType<PaymentGroup> {
	public static readonly POS = new PaymentGroup("POS", "POS", "Point-Of-Sale Terminals (POS)");
	public static readonly QR_STANDEE = new PaymentGroup("QR_STANDEE", "QR", "Printed Media (QR Standee)");
	public static readonly ONLINE_STORE = new PaymentGroup("ONLINE_STORE", "Online Store", "Online Store");
	public static readonly SOCIAL_MEDIA = new PaymentGroup("SOCIAL_MEDIA", "Social Media", "Social Media (Facebook, Instagram)");

	private constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly description: string
	) {
		super(name);
		this.displayName = displayName;
		this.description = description;
	}

	public static getValues(): PaymentGroup[] {
		return [this.POS, this.QR_STANDEE, this.ONLINE_STORE, this.SOCIAL_MEDIA];
	}

	public static getByName(name: string) : PaymentGroup {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}

}
