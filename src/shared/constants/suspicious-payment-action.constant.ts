import { EnumType } from "./enum-type.constant";

export class SuspiciousPaymentActionConstant extends EnumType<SuspiciousPaymentActionConstant>{ 
    public static readonly RISK_BLOCK = new SuspiciousPaymentActionConstant('RISK_BLOCK', 'Risk Block', 'Block');
    public static readonly RISK_ALERT = new SuspiciousPaymentActionConstant('RISK_ALERT', 'Risk Alert', 'Alert');

    constructor(public readonly name: string, public readonly displayName: string, public readonly action: string){
        super(name);
        this.displayName = displayName;
        this.action = action;
    }

    public static getValues(): SuspiciousPaymentActionConstant[] {
        return [
            this.RISK_BLOCK,
            this.RISK_ALERT
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