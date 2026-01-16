import { EnumType } from "./enum-type.constant";

export class SettlementMediumConstant extends EnumType<SettlementMediumConstant>{
    public static readonly BANK_AC = new SettlementMediumConstant('BANK_AC', 'Financial Institution');
    public static readonly EWALLET_AC = new SettlementMediumConstant('EWALLET_AC', 'e-Wallet account');

    constructor (public readonly name: string, public readonly displayname: string,) {
        super(name);
        this.displayname = displayname
    }

    public static getValues(): SettlementMediumConstant[] {
        return [
            this.BANK_AC,
            this.EWALLET_AC
        ]
    }
    public static getByName(name: string) {
        let results = this.getValues().filter(item => item.name === name);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }
}