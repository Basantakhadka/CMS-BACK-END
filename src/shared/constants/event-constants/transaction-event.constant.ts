import { EnumType } from "../enum-type.constant";

export class SaveTransactionEventType extends EnumType<SaveTransactionEventType>{
    public static readonly TRANSACTIONS_PERFORMED = new SaveTransactionEventType('transactions_performed', 'transactions_performed', 'transactions_performed');
    public static readonly TRANSACTIONS_RECORDED = new SaveTransactionEventType('transactions_recorded', 'transactions_recorded', 'transactions_recorded');
    public static readonly ISSUERS_TRANSACTIONS_RECORDED = new SaveTransactionEventType('issuers-transactions-recorded', 'issuers-transactions-recorded', 'issuers-transactions-recorded');
    private readonly TOPIC_PREFIX = `${process.env.DEPLOYMENT_NAMESPACE}-`;

    constructor(public readonly name:string, private readonly topicName:string, private readonly groupId:string){
        super(name);
        this.topicName = topicName;
        this.groupId = groupId;
    }

    public static getValues():SaveTransactionEventType[]{
        return[
            this.TRANSACTIONS_PERFORMED,
            this.TRANSACTIONS_RECORDED,
            this.ISSUERS_TRANSACTIONS_RECORDED
        ]
    }

    public static getByName(name : string){
        let results = this.getValues().filter(item => item.name === name);
        if(results && results.length > 0){
          return results[0];
        }
        return null;
    }
    
    public getTopicName():string{
        return this.TOPIC_PREFIX + this.topicName;
    }

    public getGroupId():string{
        return this.TOPIC_PREFIX + this.groupId;
    }
}