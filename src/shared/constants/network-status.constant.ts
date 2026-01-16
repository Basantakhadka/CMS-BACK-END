import { EnumType } from "./enum-type.constant";

export class NetworkStatusConstant extends EnumType<NetworkStatusConstant> {

    public static readonly AUTHORIZED = new NetworkStatusConstant('AUTHORIZED', 'Authorized');
    public static readonly PARTIAL_AUTHORIZED = new NetworkStatusConstant('PARTIAL_AUTHORIZED', 'Partial Authorized');
    public static readonly AUTHORIZED_PENDING_REVIEW = new NetworkStatusConstant('AUTHORIZED_PENDING_REVIEW', 'Authorized Pending Review');
    public static readonly AUTHORIZED_RISK_DECLINED = new NetworkStatusConstant('AUTHORIZED_RISK_DECLINED', 'Authorized Risk Declined');
    public static readonly PENDING_AUTHENTICATION = new NetworkStatusConstant('PENDING_AUTHENTICATION', 'Pending Authentication');
    public static readonly PENDING_REVIEW = new NetworkStatusConstant('PENDING_REVIEW', 'Pending Review');
    public static readonly DECLINED = new NetworkStatusConstant('DECLINED', 'Declined');
    public static readonly INVALID_REQUEST = new NetworkStatusConstant('INVALID_REQUEST', 'Invalid Request');
    public static readonly PENDING = new NetworkStatusConstant('PENDING', 'Pending');
    public static readonly VOIDED = new NetworkStatusConstant('VOIDED', 'Voided');
	constructor(
		public readonly name: string,
		public readonly displayname: string
	) {
		super(name);
		this.displayname = displayname;
	}

	public static getValues(): NetworkStatusConstant[] {
		return [
            this.AUTHORIZED, this.AUTHORIZED_PENDING_REVIEW, this.AUTHORIZED_RISK_DECLINED, this.PARTIAL_AUTHORIZED,
            this.PENDING_AUTHENTICATION, this.PENDING_REVIEW, this.DECLINED, this.INVALID_REQUEST, this.PENDING, this.VOIDED
		];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
	public static getNames(): Array<string> {
		let response: Array<string> = [];
		let results = this.getValues().map((type) => {
			response.push(type.name);
		});
		return response;
	}
}
