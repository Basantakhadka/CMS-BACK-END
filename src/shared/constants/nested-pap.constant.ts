import { PaymentMode } from "./payment-mode.constant";

// Define an interface for PaymentType details
interface PaymentTypeDetails {
	label: string;
	value: string;
}

export class NestedPaymentModes {
	public static readonly CARD = new NestedPaymentModes("CARD", "Card", [
		PaymentMode.CONTACT_LESS,
		PaymentMode.CARD_CHIP,
		PaymentMode.CARD_MAG,
		PaymentMode.CARD_MANUAL,
	]);
	public static readonly QR = new NestedPaymentModes("QR", "QR", [
		PaymentMode.QR_DYNAMIC,
		PaymentMode.QR_STATIC,
	]);
	public static readonly NFC = new NestedPaymentModes("NFC", "NFC (Mobile)", [
		PaymentMode.MOBILE_NFC,
	]);

	constructor(
		public readonly value: string,
		public readonly label: string,
		public readonly paymentMode: PaymentMode[]
	) {}
}

export class NestedPAPs {
	public static readonly POS = new NestedPAPs("POS", "Point of Sale (POS)", [
		NestedPaymentModes.CARD,
		NestedPaymentModes.QR,
		NestedPaymentModes.NFC,
	]);
	public static readonly QR_GROUP = new NestedPAPs("QR_GROUP", "QR Group", [
		NestedPaymentModes.QR,
	]);
	public static readonly WEB_CHECKOUT = new NestedPAPs(
		"WEB_CHECKOUT",
		"Web Checkout",
		[NestedPaymentModes.CARD, NestedPaymentModes.QR]
	);
	public static readonly WALLET = new NestedPAPs("WALLET", "Wallet", []);
	public static readonly CBDC = new NestedPAPs("CBDC", "CBDC", []);

	constructor(
		public readonly value: string,
		public readonly label: string,
		public readonly paymentMode: NestedPaymentModes[]
	) {}

	getDropdownDataByPAP(papValue: string): PaymentTypeDetails[] {
		const paymentModeMap = {
			POS: {
				CARD: getPaymentTypeDetails("POS_CARD"),
				QR: getPaymentTypeDetails("POS_QR"),
				MOBILE_NFC: getPaymentTypeDetails("POS_MOBILE_NFC"),
			},
			QR_GROUP: {
				QR: getPaymentTypeDetails("QR_GROUP_QR"),
			},
			WEB_CHECKOUT: {
				CARD: getPaymentTypeDetails("WEB_CHECKOUT_CARD"),
				QR: getPaymentTypeDetails("WEB_CHECKOUT_QR"),
			},
			// Add entries for WALLET and CBDC if needed (assuming they have no payment modes)
			WALLET: [],
			CBDC: [],
		};

		// Access payment type details based on PAP and selected payment mode
		return (
			paymentModeMap[papValue]?.[this.paymentMode.map((m) => m.value)[0]] || []
		);
	}
}

function getPaymentTypeDetails(key: string): PaymentTypeDetails[] {
	console.warn(`Payment type details for key '${key}' not implemented yet.`);
	return [];
}
