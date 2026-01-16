import { TransactionStatus } from "./transaction-status.constant";
import { TransactionType } from "./transaction-type.constant";

export class EnumType{
    name : string;

    constructor(name: string){
      this.name = name;
    }

    static getValues(): TransactionOutcomeType[]{
      throw new Error("EnumType getValues() not implemented.");
    }

    static getByName(name : string){
      throw new Error("EnumType getByName() not implemented.");
    }
}

export class TransactionTypeWithStatus{
  constructor(public  type:string, public status:string){}
}

export class TransactionOutcomeType extends EnumType{

  static mapTypeWithStatus(){
    let typesWithStatus: Array<TransactionTypeWithStatus> = []
    TransactionType.getValues().map(type=>{
      typesWithStatus.push({type:type.name, status:TransactionStatus.DECLINED.name})
    })
    return typesWithStatus;
  }
  public static readonly SALE = new TransactionOutcomeType('SALE', 'Sale',[{type:TransactionType.SALE.name, status:TransactionStatus.SUCCESS.name},{type:TransactionType.PRE_AUTH.name, status:TransactionStatus.SUCCESS.name}]);
  public static readonly VOID = new TransactionOutcomeType('VOID', 'Void', [{type: TransactionType.VOID.name, status: TransactionStatus.SUCCESS.name}]);
  public static readonly REFUND = new TransactionOutcomeType('REFUND', 'Refund', [{type:TransactionType.REFUND.name, status:TransactionStatus.SUCCESS.name}]);
  public static readonly DECLINED = new TransactionOutcomeType('DECLINED', 'Declined', this.mapTypeWithStatus());

  private constructor(public readonly name: string, public readonly displayName: string, public readonly transactionTypeWithStatus:TransactionTypeWithStatus[]) {
    super(name);
    this.displayName = displayName;
    this.transactionTypeWithStatus = transactionTypeWithStatus;
  }

  public static getValues(): TransactionOutcomeType[]{
    return [
      this.SALE,
      this.VOID,
      this.REFUND,
      this.DECLINED
    ];
  }

  public static getByName(name : string){
    let results = this.getValues().filter(item => item.name === name);
    if(results && results.length > 0){
      return results[0];
    }
    return null;
  }

}
