import { LabelValuePair } from "../entities/label-value-pair.view";
import { BusinessTypeGroupConstant } from "./business-type-group.constant";
import { EnumType } from "./enum-type.constant";

export class PaymentPointsOptionsConstant extends EnumType<PaymentPointsOptionsConstant>{
    public static readonly QR_STATIC = new PaymentPointsOptionsConstant('QR_STATIC', 'Static QR');
    public static readonly QR_DYNAMIC = new PaymentPointsOptionsConstant('QR_DYNAMIC', 'Dynamic QR');
    public static readonly POS = new PaymentPointsOptionsConstant('POS', 'POS');
    public static readonly WEB_CHECKOUT = new PaymentPointsOptionsConstant('WEB_CHECKOUT', 'Web Checkout (Online Store)');
    public static readonly PAYMENT_LINK = new PaymentPointsOptionsConstant('PAYMENT_LINK', 'Payment Link');
    public static readonly NFC = new PaymentPointsOptionsConstant('NFC', 'NFC');
    public static readonly QR = new PaymentPointsOptionsConstant('QR', 'QR'); 
    public static readonly QR_GROUP = new PaymentPointsOptionsConstant('QR_GROUP', 'QR Group');
    public static readonly MNO = new PaymentPointsOptionsConstant('MNO', 'MNO'); 
    public static readonly CASH = new PaymentPointsOptionsConstant('CASH', 'Cash'); 
    public static readonly PREPAID_CARD = new PaymentPointsOptionsConstant('PREPAID_CARD', 'Prepaid Card'); 

    constructor (public readonly name: string, public readonly displayName: string,) {
        super(name);
        this.displayName = displayName;
    }
    public static getValues(): PaymentPointsOptionsConstant[] {
        return [
            this.QR_STATIC,
            this.QR_DYNAMIC,
            this.POS,
            this.QR,
            this.WEB_CHECKOUT,
            this.PAYMENT_LINK,
            this.NFC,
            this.QR_GROUP, 
            this.MNO, 
            this.CASH,
            this.PREPAID_CARD
        ]
    }
    public static getByName(name: string) {
        let results = this.getValues().filter(item => item.name === name);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }


    public static getCheckpointInLabelValuePair(paps: Array<string>): LabelValuePair[] {
        const result: LabelValuePair[] = paps?.map(pap => {
            const papDetails = this.getByName(pap);
            return {
                label: papDetails?.displayName,
                value: papDetails?.name
            } as LabelValuePair
        });

        return result;
    }
}
