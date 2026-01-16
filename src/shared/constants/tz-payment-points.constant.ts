import { EnumType } from "./enum-type.constant";
import { PaymentMode } from "./payment-mode.constant";
import { PaymentTypeConstant } from "./payment-type.constant";
export class TzPaymentPoints extends EnumType<TzPaymentPoints> {
	public static readonly POS = new TzPaymentPoints(
		"POS",
		"POS",
		["Point-Of-Sale Terminals (POS)"],
		[PaymentMode.MNO, PaymentMode.CASH,PaymentMode.PREPAID_CARD,PaymentMode.CARD],
		{
			["POS_" + PaymentMode.MNO.value]: [
				{ label: "USSD Push", value: PaymentTypeConstant.USSD_PUSH.name },
			],
			["POS_" + PaymentMode.CASH.value]: [
				{ label: "Cash", value: PaymentTypeConstant.CASH.name },
			],
			["POS_" + PaymentMode.PREPAID_CARD.value]: [
				{ label: "Pre-paid Card", value: PaymentTypeConstant.PREPAID_CARD.name },
			],
			["POS_" + PaymentMode.CARD.value]:  [
				{
					label: "Contact Less Card",
					value: PaymentTypeConstant.CARD_NFC.name,
				},
				{
					label: "Card Chip",
					value: PaymentTypeConstant.CARD_CHIP.name,
				},
				{
					label: "Swipe Card",
					value: PaymentTypeConstant.CARD_MAG.name,
				},
				{
					label: "Manual Card",
					value: PaymentTypeConstant.CARD_MANUAL.name,
				},
			]
		}
	);
	private constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly alias: Array<string>,
		public readonly relyingPaymentMode: PaymentMode[] = [],
		public readonly relyingPaymentType: any = {}
	) {
		super(name);
		this.displayName = displayName;
		this.alias = alias;
	}
	public static getValues(): TzPaymentPoints[] {
		return [this.POS];
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
	public static getNames(): Array<string> {
		return [this.POS.name];
	}
	public static getDropdownData() {
		return [this.POS];
	}
	public static getNameByAlias(alias: string): string {
		const matchingName = this.getValues().find((obj) =>
			obj.alias.includes(alias)
		);
		const name = matchingName ? matchingName.name : null;
		return name;
	}
	public static getValuesForTxnDoughnut(): TzPaymentPoints[] {
		return [this.POS];
	}
	public static getPaymentPointsInLabelValuePair() {
		return this.getDropdownData().map((d) => {
			return { label: d.displayName, value: d.name };
		});
	}
	public static getPaymentModesOfAllPAP() {
		let data = {};
		this.getValues().forEach((d) => {
			if (d.relyingPaymentMode.length > 0) {
				data[d.name] = d.relyingPaymentMode.map((m) => {
					return { label: m.label, value: m.value };
				});
			}
		});
		return data;
	}
	public static getAllPaymentTypes() {
		let data = {};
		this.getValues().forEach((d) => {
			Object.assign(data, d.relyingPaymentType);
		});
		return data;
	}
	public static getConstantByDropdownData(
		dropdownValue: string
	): TzPaymentPoints {
		if (!dropdownValue) {
			return null;
		}
		let results = this.getDropdownData().filter(
			(item) => item.name === dropdownValue
		);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
	public static getAllPaymentTypesInLabelValuePair(paymentPoints: string[]) {
		let data = {};
		paymentPoints.forEach((d) => {
			if (this.getByName(d)?.relyingPaymentType) {
				Object.assign(data, this.getByName(d).relyingPaymentType);
			}
		});
		return Object.keys(data).map((key) => {
			return { label: data[key].label, value: key };
		});
	}
}
