import { EnumType } from "./enum-type.constant";

export class SettlementStatusConstant extends EnumType<SettlementStatusConstant>{
    public static readonly SETTLED = new SettlementStatusConstant('SETTLED', 'Settled');
    public static readonly UNSETTLED = new SettlementStatusConstant('UNSETTLED', 'Unsettled');

    constructor (public readonly name: string, public readonly displayname: string) {
        super(name);
        this.displayname = displayname
    }

    public static getValues(): SettlementStatusConstant[] {
        return [
            this.SETTLED,
            this.UNSETTLED
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