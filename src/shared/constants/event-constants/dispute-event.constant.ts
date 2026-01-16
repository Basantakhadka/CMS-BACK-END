import { EnumType } from "../enum-type.constant";

export class DisputeEventType extends EnumType<DisputeEventType>{
    public static readonly DISPUTE_RECORDED = new DisputeEventType('dispute-recorded', 'dispute-recorded', 'dispute-recorded');
    public static readonly ISSUERS_DISPUTE_RECORDED = new DisputeEventType('issuers-dispute-recorded', 'issuers-dispute-recorded', 'issuers-dispute-recorded');
    private readonly TOPIC_PREFIX = `${process.env.DEPLOYMENT_NAMESPACE}_`;

    constructor(public readonly name:string, private readonly topicName:string, private readonly groupId:string){
        super(name);
        this.topicName = topicName;
        this.groupId = groupId;
    }

    public static getValues():DisputeEventType[]{
        return[
            this.DISPUTE_RECORDED,
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