import { EnumType } from "./enum-type.constant";

export class NetworkTransactionStatus extends EnumType<NetworkTransactionStatus>{
    public static readonly AUTHORIZED = new NetworkTransactionStatus('AUTHORIZED', 'Authorized');
    public static readonly VOIDED = new NetworkTransactionStatus('VOIDED', 'Voided');
    public static readonly PENDING = new NetworkTransactionStatus('PENDING', 'Pending');
    public static readonly PENDING_AUTHENTICATION = new NetworkTransactionStatus('PENDING_AUTHENTICATION', 'Pending Authentication');
    public static readonly INVALID_REQUEST =  new NetworkTransactionStatus('INVALID_REQUEST','Invalid Request');
    public static readonly DECLINED = new NetworkTransactionStatus('DECLINED', 'Declined');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():NetworkTransactionStatus[]{
        return[
            this.AUTHORIZED,
            this.VOIDED,
            this.PENDING,
            this.PENDING_AUTHENTICATION,
            this.INVALID_REQUEST,
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
        const NetworkTransactionStatus = [];
        this.getValues().map(txnStatus=>{
          NetworkTransactionStatus.push(txnStatus.name);
        })
        return NetworkTransactionStatus;
    }
}