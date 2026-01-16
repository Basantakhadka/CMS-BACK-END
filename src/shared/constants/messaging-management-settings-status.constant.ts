import { EnumType } from "./enum-type.constant";

export class MessagingnManagementSettingsStatus extends EnumType<MessagingnManagementSettingsStatus> {
    public static readonly RISK_MANAGEMENT = new MessagingnManagementSettingsStatus('RISK_MANAGEMENT', 'Risk Management');
    public static readonly SMS = new MessagingnManagementSettingsStatus('SMS', 'Sms');
    public static readonly EMAIL = new MessagingnManagementSettingsStatus('EMAIL', 'Email');
    constructor(public readonly name: string, public readonly displayName: string){ 
        super(name);
        this.displayName = displayName;
    }

    public static getValues(): MessagingnManagementSettingsStatus[] {
        return [
            this.RISK_MANAGEMENT
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