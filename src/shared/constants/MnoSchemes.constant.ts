import { EnumType } from "./enum-type.constant";

export class MnoSchemesConstant extends EnumType<MnoSchemesConstant> {
	public static readonly AIRTEL = new MnoSchemesConstant("AIRTEL", "Airtel");
	public static readonly TIGO = new MnoSchemesConstant("TIGO", "TigoPesa");
	public static readonly MPESA = new MnoSchemesConstant("MPESA", "MPesa");
	public static readonly HALOPESA = new MnoSchemesConstant(
		"HALOPESA",
		"HaloPesa"
	);
	public static readonly TPESA = new MnoSchemesConstant("TPESA", "TPesa");

	private constructor(
		public readonly name: string,
		public readonly displayName: string
	) {
		super(name);
		this.displayName = displayName;
	}

	public static getValues(): MnoSchemesConstant[] {
		return [this.AIRTEL, this.TIGO, this.MPESA, this.HALOPESA, this.TPESA];
	}

	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
}
