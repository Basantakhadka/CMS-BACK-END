import { EnumType } from "./enum-type.constant";

export class CurrencyType extends EnumType<CurrencyType> {
	public static readonly NPR = new CurrencyType("NPR", "NPR", "Rs.");

	private constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly currencySymbol: string
	) {
		super(name);
		this.displayName = displayName;
		this.currencySymbol = this.currencySymbol;
	}

	public static getValues(): CurrencyType[] {
		return [this.NPR];
	}

	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}

	public static getNames() {
		const currencies = [];
		this.getValues().map((currency) => {
			currencies.push(currency.name);
		});
		return currencies;
	}
}