import { EnumType } from "../enum-type.constant";

export class QrRequestedEventConstant extends EnumType<QrRequestedEventConstant>{
    public static readonly QR_REQUESTED = new QrRequestedEventConstant('QR_REQUESTED', 'qr_requested', 'QR_REQUESTED');
    private readonly TOPIC_PREFIX = `${ process.env.DEPLOYMENT_NAMESPACE }_`;

    constructor (public readonly name: string, private readonly topicName: string, private readonly groupId: string) {
        super(name);
        this.topicName = topicName;
        this.groupId = groupId;
    }

    public static getValues(): QrRequestedEventConstant[] {
        return [
            this.QR_REQUESTED
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