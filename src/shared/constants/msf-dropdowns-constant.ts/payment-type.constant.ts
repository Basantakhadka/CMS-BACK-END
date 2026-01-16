import { ValueWithLabelEnumType } from "./value-with-label-enum-type.constant";

export class PaymentType extends ValueWithLabelEnumType<PaymentType>{
  public static readonly CARD = new PaymentType('CARD', 'Card');
  public static readonly CARD_MANUAL = new PaymentType('CARD_MANUAL', 'Manual Card'); 
  public static readonly QR = new PaymentType('QR', 'Qr');
  public static readonly TAPnPAY=new PaymentType('TAPnPAY','Tap And Pay')
  
  private constructor(public readonly value: string, public readonly label: string) {
    super(value);
    this.value = value;
  }
  public static getValues(): PaymentType[]{
    return [
      this.CARD,
      this.QR,
      this.CARD_MANUAL,
      this.TAPnPAY
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
