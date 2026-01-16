import { ValueWithLabelEnumType } from "./value-with-label-enum-type.constant";


export class PaymentNetwork extends ValueWithLabelEnumType<PaymentNetwork>{
  public static readonly VISA = new PaymentNetwork('VISA', 'Visa');
  public static readonly UNIONPAY = new PaymentNetwork('UNIONPAY', 'Union Pay');
  public static readonly NEPALPAY = new PaymentNetwork('NEPALPAY', 'Nepal Pay');
  public static readonly FONEPAY = new PaymentNetwork('FONEPAY', 'FonePay');
  public static readonly MASTER_CARD = new PaymentNetwork('MASTER_CARD', 'Master Card');
  public static readonly SCT = new PaymentNetwork('SCT', 'Sct');
  
  private constructor(public readonly value: string, public readonly label: string) {
    super(value);
    this.label = label;
  }
  public static getValues(): PaymentNetwork[]{
    return [
      this.VISA,
      this.UNIONPAY,
      this.NEPALPAY,
      this.FONEPAY,
      this.MASTER_CARD,
      this.SCT
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
