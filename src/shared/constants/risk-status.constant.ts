import { EnumType } from "./enum-type.constant";

export class RiskStatus extends EnumType<RiskStatus>{
    public static readonly ACTIVE = new RiskStatus('ACTIVE', 'Active', true);
    public static readonly INACTIVE = new RiskStatus('INACTIVE', 'Inactive', false);

    constructor (
        public readonly name: string, 
        public readonly displayname: string,
        public readonly booleanValue: boolean
    ) {
        super(name);
    }

    public static getValues(): RiskStatus[] {
        return [
            this.ACTIVE,
            this.INACTIVE,
        ]
    }
    public static getByBooleanValue(booleanValue: boolean) {
        let results = this.getValues().filter(item => item.booleanValue === booleanValue);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }
}