import { ConfigurationRecordsRepository } from "@app/feature/merchants-onboarding/repositories/configuration-records.repository";
import { EnumType } from "./enum-type.constant";
import { PaymentMode } from "./payment-mode.constant";
import { PaymentTypeConstant } from "./payment-type.constant";

export class PaymentPoints extends EnumType<PaymentPoints> {
	private static readonly SYSTEM_CONFIG_ID = "global.citytech.member.features.config.settings.SystemConfiguration";
	public static readonly QR_STANDEE = new PaymentPoints("QR_STANDEE", "QR", [
		"QR",
	]);
	public static readonly DEFAULT = new PaymentPoints("DEFAULT", "Default", [
		"Default",
	],
		[PaymentMode.CARD],
		{
			["DEFAULT_" + PaymentMode.CARD.value]: [
				{
					label: "Card",
					value: "CARD",
				},
			],
		}
	);
	public static readonly POS = new PaymentPoints(
		"POS",
		"POS",
		["Point-Of-Sale Terminals (POS)"],
		[PaymentMode.CARD, PaymentMode.QR, PaymentMode.MOBILE_NFC],
		{
			["POS_" + PaymentMode.CARD.value]: [
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
			],
			["POS_" + PaymentMode.QR.value]: [
				{
					label: "Dynamic QR",
					value: PaymentTypeConstant.QR_DYNAMIC.name,
				},
				{
					label: "Static QR",
					value: PaymentTypeConstant.QR_STATIC.name,
				},
			],
			["POS_" + PaymentMode.MOBILE_NFC.value]: [
				{
					label: "Mobile NFC",
					value: 'MOBILE_NFC',
				},
			],
		}
	);
	public static readonly WEB_CHECKOUT = new PaymentPoints(
		"WEB_CHECKOUT",
		"Web Checkout",
		["Online Store"],
		[PaymentMode.CARD, PaymentMode.QR],
		{
			["WEB_CHECKOUT_" + PaymentMode.CARD.value]: [
				{
					label: "Manual Card",
					value: PaymentTypeConstant.CARD_MANUAL.name,
				},
			],
			["WEB_CHECKOUT_" + PaymentMode.QR.value]: [
				{
					label: "Dynamic QR",
					value: PaymentTypeConstant.QR_DYNAMIC.name,
				},
			],
		}
	);
	public static readonly PAYMENT_LINK = new PaymentPoints(
		"PAYMENT_LINK",
		"Payment Link",
		["Payment Link"]
	);
	public static readonly QR = new PaymentPoints("QR", "QR", ["QR"]);
	public static readonly WALLET = new PaymentPoints("WALLET", "Wallet", [
		"Wallet",
	]);
	public static readonly CBDC = new PaymentPoints("CBDC", "CBDC", ["CBDC"]);
	public static readonly QR_GROUP = new PaymentPoints(
		"QR_GROUP",
		"QR Group",
		["Dynamic QR", "Static QR"],
		[PaymentMode.QR],
		{
			["QR_GROUP_" + PaymentMode.QR.value]: [
				{
					label: "Dynamic QR",
					value: PaymentTypeConstant.QR_DYNAMIC.name,
				},
				{
					label: "Static QR",
					value: PaymentTypeConstant.QR_STATIC.name,
				},
			],
		}
	);
	private constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly alias: Array<string>,
		public readonly relyingPaymentMode: PaymentMode[] = [],
		public readonly relyingPaymentType: any = {},
		public readonly servicePlatforms: Array<{ label: string; value: string }> = []
	) {
		super(name);
		this.displayName = displayName;
		this.alias = alias;
	}
	public static getValues(): PaymentPoints[] {
		return [
			this.POS,
			this.QR_STANDEE,
			this.WEB_CHECKOUT,
			this.PAYMENT_LINK,
			this.QR,
			this.WALLET,
			this.CBDC,
			this.QR_GROUP,
			this.DEFAULT,
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
	public static getNames(): Array<string> {
		return [
			this.POS.name,
			this.QR_STANDEE.name,
			this.WEB_CHECKOUT.name,
			this.PAYMENT_LINK.name,
			this.QR.name,
			this.WALLET.name,
			this.CBDC.name,
			this.DEFAULT.name,
		];
	}
	public static getDropdownData() {
		return [this.POS, this.QR_GROUP, this.WEB_CHECKOUT, this.WALLET, this.CBDC,this.DEFAULT];
	}
	public static getNameByAlias(alias: string): string {
		const matchingName = this.getValues().find((obj) =>
			obj.alias.includes(alias)
		);
		const name = matchingName ? matchingName.name : null;
		return name;
	}
	public static getValuesForTxnDoughnut(): PaymentPoints[] {
		return [this.QR_GROUP, this.POS, this.WEB_CHECKOUT];
	}
	public static getPaymentPointsInLabelValuePair() {
		return this.getDropdownData().map((d) => {
			return {
				label: d.displayName,
				value: d.name,
			};
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

	public static async getPAPApplicableServicePlatforms(ConfigurationRecordsRepository:ConfigurationRecordsRepository , institutionCode:string ):Promise<Record<string, Array<{ label: string; value: string }>>> {
		const configurationRecord : any =
				await ConfigurationRecordsRepository.findById(
					this.SYSTEM_CONFIG_ID,
					institutionCode
				);
 		const listOfServicePlatform = configurationRecord?.value?.listOfServicePlatform || []

		let data = transformServicePlatforms(listOfServicePlatform);

		return data;
	}



	public static getConstantByDropdownData(
		dropdownValue: string
	): PaymentPoints {
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
			return {
				label: data[key].label,
				value: key,
			};
		});
	}
}

function transformServicePlatforms(
  data: Array<{
    code: string;
    name: string;
    applicables: string;
    integrationInfo: string;
  }>
): Record<string, Array<{ label: string; value: string }>> {
  const result: Record<string, Array<{ label: string; value: string }>> = {};

  data.forEach(platform => {
    const applicablesList = platform.applicables
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    applicablesList.forEach(applicable => {
      if (!result[applicable]) {
        result[applicable] = [];
      }

      result[applicable].push({
        label: platform.name,
        value: platform.code
      });
    });
  });

  return result;
}