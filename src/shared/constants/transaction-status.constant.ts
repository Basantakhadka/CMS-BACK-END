import { LabelValuePair } from "../entities/label-value-pair.view";
import { EnumType } from "./enum-type.constant";

export enum TransactionPeriodConstant{
    TODAY = 'today',
    MOHTH = 'month',
    ALL = 'all'
}
export class TransactionStatus extends EnumType<TransactionStatus>{
    public static readonly REQUEST_RECEIVED = new TransactionStatus('REQUEST_RECEIVED', 'Request Received');
    public static readonly PROCESSING =  new TransactionStatus('PROCESSING','Processing');
    public static readonly SUCCESS = new TransactionStatus('SUCCESS', 'Success');
    public static readonly FAILED = new TransactionStatus('FAILED', 'Failed');
    public static readonly DECLINED = new TransactionStatus('DECLINED', 'Declined');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():TransactionStatus[]{
        return[
            this.REQUEST_RECEIVED,
            this.PROCESSING,
            this.SUCCESS,
            this.FAILED,
            this.DECLINED
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
        const transactionStatus = [];
        this.getValues().map(txnStatus=>{
          transactionStatus.push(txnStatus.name);
        })
        return transactionStatus;
    }

    public static getByLabelValuePair(): LabelValuePair[] {
        const result = this.getValues().map(item => {
            return new LabelValuePair(item.displayname, item.name);
        })

        return result;
    }
}