import { EnumType } from "../enum-type.constant";

export class KakfkaIamEventConstant extends EnumType<KakfkaIamEventConstant>{
    public static readonly USER_CREATED = new KakfkaIamEventConstant('USER_CREATED', 'member-user-created', 'member-user-created-group', 'user-created');
    public static readonly RESET_USER_PASSWORD = new KakfkaIamEventConstant('RESET_USER_PASSWORD', 'member-reset-user-password', 'member-reset-user-password-group', 'reset-user-password');
    public static readonly USER_SEND_EMAIL = new KakfkaIamEventConstant('USER_SEND_EMAIL', 'member-user-send-email', 'member-user-send-email-group', 'email-notification');

    private readonly TOPIC_PREFIX = process.env.DEPLOYMENT_NAMESPACE ? `${ process.env.DEPLOYMENT_NAMESPACE }_` : '';

    constructor (public readonly name: string, public readonly topicName: string, public readonly groupId: string, public readonly key: string) {
        super(name);
        this.topicName = topicName;
        this.groupId = groupId;
        this.key = key;
    }

    public static getValues(): KakfkaIamEventConstant[] {
        return [
            this.USER_CREATED,
            this.RESET_USER_PASSWORD
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