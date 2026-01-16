import { EnumType } from "../enum-type.constant";

export class MerchantOnboardingEventType extends EnumType<MerchantOnboardingEventType>{
    public static readonly MERCHANT_ONBOARD_INITIATED = new MerchantOnboardingEventType('MERCHANT_ONBOARD_INITIATED', 'MERCHANT_ONBOARD_INITIATED', 'MERCHANT_ONBOARD_INITIATED');
    public static readonly MERCHANT_ONBOARD_APPROVED = new MerchantOnboardingEventType('MERCHANT_ONBOARD_APPROVED', 'MERCHANT_ONBOARD_APPROVED', 'MERCHANT_ONBOARD_APPROVED');
    public static readonly MERCHANT_ENROLLED = new MerchantOnboardingEventType('MERCHANT_ENROLLED', 'MERCHANT_ENROLLED', 'MERCHANT_ENROLLED');
    private readonly TOPIC_PREFIX = `${process.env.DEPLOYMENT_NAMESPACE}-`;

    constructor(public readonly name:string, private readonly topicName:string, private readonly  groupId:string){
        super(name);
        this.topicName = topicName;
        this.groupId = groupId;
    }

    public static getValues():MerchantOnboardingEventType[]{
        return[
            this.MERCHANT_ONBOARD_INITIATED,
            this.MERCHANT_ONBOARD_APPROVED,
            this.MERCHANT_ENROLLED
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