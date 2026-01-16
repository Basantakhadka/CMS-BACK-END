import { LabelValuePair } from "../entities/label-value-pair.view";
import { ValueWithLabelEnumType } from "./msf-dropdowns-constant.ts/value-with-label-enum-type.constant";
export class PaymentMode extends ValueWithLabelEnumType<PaymentMode> {
	public static readonly CONTACT_LESS = new PaymentMode(
		"CARD_NFC",
		"Contact Less Card"
	);
	public static readonly DEFAULT = new PaymentMode("DEFAULT", "Default");
	static readonly STATIC_QR = new PaymentMode("STATIC_QR", "Static QR");
	static readonly DYNAMIC_QR = new PaymentMode("DYNAMIC_QR", "Dynamic QR");

	static readonly CARD_CHIP = new PaymentMode("CARD_CHIP", "Card Chip");
	public static readonly CARD_MAG = new PaymentMode("CARD_MAG", "Swipe Card");
	public static readonly QR_DYNAMIC = new PaymentMode(
		"QR_DYNAMIC",
		"Dynamic QR",
		"#9DDCF9",
		["#9DDCF9", "rgb(157, 220, 249,0.2)"]
	);
	static readonly QR_STATIC = new PaymentMode(
		"QR_STATIC",
		"Static QR",
		"#FFDCBC",
		["#FFDCBC", "rgb(255, 220, 188,0.2)"]
	);
	public static readonly MOBILE_NFC = new PaymentMode(
		"MOBILE_NFC",
		"Mobile NFC"
	);
	public static readonly CARD_MANUAL = new PaymentMode(
		"CARD_MANUAL",
		"Manual Card"
	);
	public static readonly QR = new PaymentMode("QR", "QR");
	public static readonly CARD = new PaymentMode("CARD", "Card");
	public static readonly NFC = new PaymentMode("NFC", "NFC");
	public static readonly WEB_CHECKOUT = new PaymentMode(
		"WEB_CHECKOUT",
		"Web Checkout"
	);
	public static readonly MNO = new PaymentMode("MNO", "MNO");
	public static readonly CASH = new PaymentMode("CASH", "Cash");
	public static readonly USSD_PUSH = new PaymentMode("USSD_PUSH", "USSD Push");
	public static readonly PREPAID_CARD = new PaymentMode("PREPAID_CARD", "Pre-paid Card");


	private constructor(
		public readonly value: string,
		public readonly label: string,
		public readonly legendColor: string = "#000000",
		public readonly colorPalette: string[] = []
	) {
		super(value);
		this.label = label;
		this.legendColor = legendColor;
		this.colorPalette = colorPalette;
	}
	public static getValues(): PaymentMode[] {
		return [
			this.CONTACT_LESS,
			this.CARD_CHIP,
			this.CARD_MAG,
			this.QR_DYNAMIC,
			this.QR_STATIC,
			this.MOBILE_NFC,
			this.CARD_MANUAL,
			this.QR,
			this.CARD,
			this.NFC,
			this.WEB_CHECKOUT,
			this.MNO,
			this.CASH,
			this.USSD_PUSH,
			this.DEFAULT,
			this.STATIC_QR,
			this.DYNAMIC_QR,
			this.PREPAID_CARD
		];
	}
	public static getByName(value: string) {
		let results = this.getValues().filter((item) => item.value === value);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
	public static checkQrStaticIsPresentFromList(
		paymentModes: string[]
	): boolean {
		if (!paymentModes?.length) {
			return null;
		}
		return !!paymentModes.filter((mode) => this.QR_STATIC.value === mode);
	}
	public static getPaymentModesInLabelValuePair(
		paymentModes: string[]
	): LabelValuePair[] {
		return paymentModes.map((mode) => {
			const type = this.getByName(mode);
			return new LabelValuePair(type.label, type.value);
		});
	}
	public static getLabelListOfPaymentModes(paymentModes: string[]): string[] {
		return paymentModes?.map((mode) => {
			if (mode == "NFC") {
				return this.MOBILE_NFC.value;
			}
			return this.getByName(mode).label;
		});
	}
	public static getQrStaticAndDynamic(): PaymentMode[] {
		return [this.QR_STATIC, this.QR_DYNAMIC];
	}
}
