import { EnumType } from "./enum-type.constant";

export class TransactionType extends EnumType<TransactionType>{
    public static readonly SALE = new TransactionType('SALE', 'Sale');
    public static readonly VOID =  new TransactionType('VOID','Void');
    public static readonly REFUND = new TransactionType('REFUND', 'Refund');
    public static readonly PRE_AUTH = new TransactionType('PRE_AUTH', 'Pre Auth');
    public static readonly REVERSAL = new TransactionType('REVERSAL', 'Reversal');
    public static readonly FUND_TRANSFER = new TransactionType('FUND_TRANSFER', 'Fund Transfer');
    public static readonly DISCOUNT = new TransactionType('DISCOUNT', 'Discount Liability');
    public static readonly SETTLEMENT = new TransactionType('SETTLEMENT', 'Settlement');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():TransactionType[]{
        return[
            this.SALE,
            this.VOID,
            this.REFUND,
            this.PRE_AUTH,
            this.REVERSAL,
            this.FUND_TRANSFER,
            this.DISCOUNT,
            this.SETTLEMENT
        ]
    }
    public static getByName(name : string){
        let results = this.getValues().filter(item => item.name === name);
        if(results && results.length > 0){
          return results[0];
        }
        return null;
    }
    public static getNames(){
        const transactionTypes = [];
        this.getValues().map(txnType=>{
          transactionTypes.push(txnType.name);
        })
        return transactionTypes;
    }

    public static getNameListOfTxnTypes(txnTypes: string[]): string[] {
        const result: string[] = txnTypes?.map(txn => {
            return this.getByName(txn)?.displayname;
        });

        return result;
    }

    
}