import { EnumType } from "../enum-type.constant";

export class KakfkaQrRequestedEventConstant extends EnumType<KakfkaQrRequestedEventConstant>{
    public static readonly QR_REQUESTED = new KakfkaQrRequestedEventConstant('QR_REQUESTED', 'qr_requested', 'qr_requested-merchant-group', 'qr-requested');

    private readonly TOPIC_PREFIX = process.env.DEPLOYMENT_NAMESPACE ? `${ process.env.DEPLOYMENT_NAMESPACE }_` : '';

    constructor (public readonly name: string, public readonly topicName: string, public readonly groupId: string, public readonly key: string) {
        super(name);
        this.topicName = topicName;
        this.groupId = groupId;
        this.key = key;
    }

    public static getValues(): KakfkaQrRequestedEventConstant[] {
        return [
            this.QR_REQUESTED,
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
        return this.groupId;
    }

    public getKey(): string {
        return this.key;
    }
}