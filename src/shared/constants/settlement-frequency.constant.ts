import { EnumType } from "./enum-type.constant";

export class SettlementFrequencyConstant extends EnumType<SettlementFrequencyConstant>{
    public static readonly SYSTEM_DEFAULT = new SettlementFrequencyConstant('SYSTEM_DEFAULT', 'System Default');
    public static readonly ON_CALL = new SettlementFrequencyConstant('ON_CALL', 'On Call');
    public static readonly REAL_TIME = new SettlementFrequencyConstant('REAL_TIME', 'Real Time ');

    constructor (public readonly name: string, public readonly displayname: string,) {
        super(name);
        this.displayname = displayname
    }

    public static getValues(): SettlementFrequencyConstant[] {
        return [
            this.SYSTEM_DEFAULT,
            this.ON_CALL,
            this.REAL_TIME
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