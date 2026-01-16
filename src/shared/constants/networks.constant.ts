import { EnumType } from "./enum-type.constant";

export class NetworksConstant extends EnumType<NetworksConstant> {
	public static readonly NQR = new NetworksConstant(
		"NQR",
		"NepalPay QR",
		"NEPALPAY_QR"
	);
	public static readonly NEPALPAY_QR = new NetworksConstant(
		"NEPALPAY_QR",
		"NepalPay QR",
		"NEPALPAY_QR"
	);
	public static readonly SmartQR = new NetworksConstant(
		"SMART_QR",
		"Smart QR",
		"SMART_QR"
	);
	public static readonly Smart_QR = new NetworksConstant(
		"Smart_QR",
		"Smart QR",
		"SMART_QR"
	);
	public static readonly CYBER_SRC = new NetworksConstant(
		"CYBER_SRC",
		"Cyber Source",
		"CYBER_SRC"
	);
	public static readonly VISA = new NetworksConstant(
		'VISA', 
		'VisaNet', 
		'VISA'
	)
	public static readonly SCT = new NetworksConstant(
		'SCT', 
		'SCT', 
		'SCT'
	)
	public static readonly FONEPAY = new NetworksConstant(
		'FONEPAY', 
		'Fone Pay', 
		'FONEPAY'
	)

	public static readonly FONEPAY_QR = new NetworksConstant(
		'FONEPAY_QR', 
		'Fone Pay', 
		'FONEPAY_QR'
	)
	public static readonly MNO = new NetworksConstant(
		'MNO',
		'MNO',
		'MNO'
	)

	public static readonly NCHL = new NetworksConstant(
		'NCHL',
		'NCHL',
		'NCHL'
	)

	public static readonly WEB_CHECKOUT = new NetworksConstant(
		'WEB_CHECKOUT', 
		'WEB_CHECKOUT', 
		'WEB_CHECKOUT'
	)

		public static readonly SELF = new NetworksConstant(
		'SELF', 
		'Self', 
		'SELF'
	)

	constructor(
		public readonly name: string,
		public readonly displayname: string,
		public readonly alias: string
	) {
		super(name);
		this.displayname = displayname;
		this.alias = alias;
	}

	public static getValues(): NetworksConstant[] {
		return [this.NQR, this.SmartQR, this.CYBER_SRC, this.VISA, this.SCT, this.FONEPAY, this.MNO,this.FONEPAY_QR,this.Smart_QR,this.NEPALPAY_QR,this.NCHL, this.WEB_CHECKOUT,this.SELF];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}

	public static getNames() {
		const networks = [];
		this.getValues().forEach((txnType) => {
			networks.push(txnType.name);
		});
		return networks;
	}

	public static getByAliasName(name: string): NetworksConstant {
		if (!name) null;
		let results = this.getValues().filter((item) => item.alias === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}

	public static getNamesListOfNetworks(networks: string[]): string[] {
		const result: string[] = networks?.map((network) => {
			return this.getByName(network)?.displayname;
		});

		return result;
	}
}