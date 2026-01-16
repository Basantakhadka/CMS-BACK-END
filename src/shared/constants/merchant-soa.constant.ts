import { EnumType } from "./enum-type.constant";

export class MerchantSOAConstant extends EnumType<MerchantSOAConstant>{
    public static readonly NEW_SIGNUP = new MerchantSOAConstant('NEW_SIGNUP', 'New Signup');
    public static readonly ENROLLED = new MerchantSOAConstant('ENROLLED', 'Enrolled');
    public static readonly ACTIVE = new MerchantSOAConstant('ACTIVE', 'Active');
    public static readonly IN_ACTIVE = new MerchantSOAConstant('IN_ACTIVE', 'Not Active');
    public static readonly ENABLED = new MerchantSOAConstant('ENABLED', 'Enabled');
    public static readonly DISABLED = new MerchantSOAConstant('DISABLED', 'Disabled');

    private constructor (public readonly name: string, public readonly displayName: string) {
        super(name);
        this.displayName = displayName;
    }

    public static getValues(): MerchantSOAConstant[] {
        return [
            this.NEW_SIGNUP,
            this.ENROLLED,
            this.ACTIVE,
            this.IN_ACTIVE,
            this.ENABLED,
            this.DISABLED
        ];
    }

    public static getByName(name: string) {
        let results = this.getValues().filter(item => item.name === name);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }

}