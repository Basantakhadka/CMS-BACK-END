import { EnumType } from "./enum-type.constant";

export class TransactionDisputeStatus extends EnumType<TransactionDisputeStatus>{
    public static readonly RESOLVED = new TransactionDisputeStatus('RESOLVED', 'Resolved');
    public static readonly UNRESOLVED = new TransactionDisputeStatus('UNRESOLVED', 'Unresolved');
    public static readonly REJECTED =  new TransactionDisputeStatus('REJECTED','Rejected');
    public static readonly IN_PROCESS = new TransactionDisputeStatus('IN_PROCESS', 'In Process');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():TransactionDisputeStatus[]{
        return[
            this.RESOLVED,
            this.REJECTED,
            this.IN_PROCESS
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