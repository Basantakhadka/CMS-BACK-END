import { ValueWithLabelEnumType } from "./msf-dropdowns-constant.ts/value-with-label-enum-type.constant";
import { PaymentMode } from "./payment-mode.constant";

export class GenericPaymentMode extends ValueWithLabelEnumType<PaymentMode>{
     public static readonly CARD = new GenericPaymentMode('CARD', [PaymentMode.CARD_CHIP,PaymentMode.CARD_MAG,PaymentMode.CARD_MANUAL,PaymentMode.CONTACT_LESS]);
     public static readonly QR = new GenericPaymentMode('QR', [PaymentMode.QR_DYNAMIC,PaymentMode.QR_STATIC]);
     public static readonly MOBILE_NFC=new GenericPaymentMode('MOBILE_NFC',[PaymentMode.MOBILE_NFC]);

  
  private constructor(public readonly value: string, public readonly label: PaymentMode[]) {
    super(value);
    this.label = label;
  }
  public static getValues(): GenericPaymentMode[]{ 
    return [
        this.CARD,
        this.QR,
        this.MOBILE_NFC
    ];
  }
  public static getByName(value : string){
    let results = this.getValues().filter(item => item.value === value);
    if(results && results.length > 0){
      return results[0];
    }
    return null;
  }
}
