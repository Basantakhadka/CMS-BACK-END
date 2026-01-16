import { EnumType } from "./enum-type.constant";

export class PaymentStatus extends EnumType<PaymentStatus>{
    public static readonly REQUEST_RECEIVED = new PaymentStatus('REQUEST_RECEIVED', 'Request Received');
    public static readonly PROCESSING = new PaymentStatus('PROCESSING', 'Processing');
    public static readonly SUCCESS = new PaymentStatus('SUCCESS', 'Success', "#009D2C", ["#009D2C", "rgba(0, 157, 44, 0.2)"]);
    public static readonly FAILED = new PaymentStatus('FAILED', 'Failed', "#740000", ["#740000", "rgba(116, 0, 0, 0.2)"]);
    public static readonly DECLINED = new PaymentStatus('DECLINED', 'Declined', "#EB2228", ["#EB2228", "rgba(235, 34, 40, 0.2)"]);

    constructor (public readonly name: string, public readonly displayName: string, public readonly legendColor:string = "#000000", public readonly colorPalette: string[] = []) {
        super(name);
        this.displayName = displayName;
        this.legendColor = legendColor;
        this.colorPalette = colorPalette;
    }

    public static getValues(): PaymentStatus[] {
        return [
            this.REQUEST_RECEIVED,
            this.PROCESSING,
            this.SUCCESS,
            this.DECLINED,
            this.FAILED
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

    public static getSuccessFaildDeclinedStatus(): PaymentStatus[] {
        return this.getValues().filter(item => item.name === 'SUCCESS' || item.name === 'DECLINED' || item.name === 'FAILED' );
    }
}