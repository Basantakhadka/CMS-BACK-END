import { EnumType } from "./enum-type.constant";

export class CurrencyCodeNumberConstant extends EnumType<CurrencyCodeNumberConstant>{
    public static readonly NPR = new CurrencyCodeNumberConstant('NPR', 'NPR', 'Rs.', '524');
    public static readonly USD = new CurrencyCodeNumberConstant('USD', 'USD', '$','000');

    private constructor (public readonly name: string, public readonly displayName: string, public readonly currencySymbol: string, public readonly codeNumber:string) {
        super(name);
        this.displayName = displayName;
        this.currencySymbol = this.currencySymbol;
        this.codeNumber = this.codeNumber;
    }

    public static getValues(): CurrencyCodeNumberConstant[] {
        return [
            this.NPR,
            this.USD
        ];
    }

    public static getByName(name: string) {
        let results = this.getValues().filter(item => item.name === name);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }

    public static getNames() {
        const currencies = [];
        this.getValues().map(currency => {
            currencies.push(currency.name);
        })
        return currencies;
    }
}