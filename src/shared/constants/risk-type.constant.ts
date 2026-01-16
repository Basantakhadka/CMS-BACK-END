import { EnumType } from "./enum-type.constant";

export class RiskTypeConstant extends EnumType<RiskTypeConstant>{
    public static readonly DEFAULT = new RiskTypeConstant('DEFAULT', 'Default', true);
    public static readonly MERCHANT_SPECIFIC = new RiskTypeConstant('MERCHANT_SPECIFIC', 'Merchant Specific', false);

    constructor (public readonly name: string, public readonly displayName: string, public readonly isDefault: boolean) {
        super(name);
        this.displayName = displayName;
        this.isDefault = isDefault;
    }

    public static getValues(): RiskTypeConstant[] {
        return [
            this.DEFAULT,
            this.MERCHANT_SPECIFIC
        ]
    }
    public static getByName(name: string) {
        let results = this.getValues().filter(item => item.name === name);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }
    public static getNames() {
        const paymentStatus = [];
        this.getValues().map(txnStatus => {
            paymentStatus.push(txnStatus.name);
        })
        return paymentStatus;
    }

    public static getByDefaultStatus(defaultStatus:boolean): RiskTypeConstant {
        let results = this.getValues().filter(item => item.isDefault === defaultStatus);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }
}