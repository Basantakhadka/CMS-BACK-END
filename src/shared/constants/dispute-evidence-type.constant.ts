import { EnumType } from "./enum-type.constant";

export class DisputeEvidenceType extends EnumType<DisputeEvidenceType>{
    public static readonly PAYMENT_SLIP = new DisputeEvidenceType('PAYMENT_SLIP', 'Payment Slip');
    public static readonly VIDEO =  new DisputeEvidenceType('VIDEO','Video');
    public static readonly NOT_AVAILABLE =  new DisputeEvidenceType('NOT_AVAILABLE','Not Available');
    public static readonly PHOTO =  new DisputeEvidenceType('PHOTO','Photo');
    public static readonly OTHER =  new DisputeEvidenceType('OTHER','Other');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():DisputeEvidenceType[]{
        return[
            this.PAYMENT_SLIP,
            this.VIDEO,
            this.NOT_AVAILABLE,
            this.PHOTO,
            this.OTHER
        ]
    }
    public static getByName(name : string){
        let results = this.getValues().filter(item => item.name === name);
        if(results && results.length > 0){
          return results[0];
        }
        return null;
    }
}