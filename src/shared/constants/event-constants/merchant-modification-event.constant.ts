import { EnumType } from "../enum-type.constant";

export class MerchantModificationEventType extends EnumType<MerchantModificationEventType>{
    public static readonly MERCHANT_PAYMENTPOINT_MANAGED = new MerchantModificationEventType('MERCHANT_PAYMENTPOINT_MANAGED', 'MERCHANT_PAYMENTPOINT_MANAGED', 'MERCHANT_PAYMENTPOINT_MANAGED');
    private readonly TOPIC_PREFIX = `${process.env.DEPLOYMENT_NAMESPACE}-`;

    constructor(public readonly name:string, private readonly topicName:string, private readonly groupId:string){
        super(name);
        this.topicName = topicName;
        this.groupId = groupId;
    }

    public static getValues():MerchantModificationEventType[]{
        return[
            this.MERCHANT_PAYMENTPOINT_MANAGED
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