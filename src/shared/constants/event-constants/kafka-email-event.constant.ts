import { EnumType } from "../enum-type.constant";

export class KafkaEmailEventConstant extends EnumType<KafkaEmailEventConstant>{
    public static readonly SEND_EMAIL = new KafkaEmailEventConstant('SEND_EMAIL', 'send-email', 'email-group');
    private readonly TOPIC_PREFIX = `${ process.env.DEPLOYMENT_NAMESPACE }-`;

    constructor (public readonly name: string, public readonly topicName: string, public readonly groupId: string) {
        super(name);
        this.topicName = `ins-${ topicName }`;
        this.groupId = `ins-${ groupId }`;
    }

    public static getValues(): KafkaEmailEventConstant[] {
        return [
            this.SEND_EMAIL
        ]
    }
    public static getByName(name: string) {
        let results = this.getValues().filter(item => item.name === name);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }

    public getTopicName(): string {
        return this.TOPIC_PREFIX + this.topicName;
    }

    public getGroupId(): string {
        return this.TOPIC_PREFIX + this.groupId;
    }

}