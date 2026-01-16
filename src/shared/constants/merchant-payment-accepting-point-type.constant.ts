import { EnumType } from "./enum-type.constant";

export class MerchantPaymentAcceptingPointTypeConstant extends EnumType<MerchantPaymentAcceptingPointTypeConstant>{
    public static readonly QR = new MerchantPaymentAcceptingPointTypeConstant('QR', 'QR');

    private constructor (public readonly name: string, public readonly displayName: string) {
        super(name);
        this.displayName = displayName;
    }

    public static getValues(): MerchantPaymentAcceptingPointTypeConstant[] {
        return [
            this.QR
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