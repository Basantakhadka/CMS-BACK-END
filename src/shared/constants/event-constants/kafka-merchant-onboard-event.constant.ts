import { EnumType } from "../enum-type.constant";

export class KakfkaMerchantOnboardEventConstant extends EnumType<KakfkaMerchantOnboardEventConstant>{
    public static readonly MERCHANT_ENROLLED = new KakfkaMerchantOnboardEventConstant('MERCHANT_ENROLLED', 'merchant-enrolled', 'merchant-enrolled-group', 'merchant-enrolled');
    public static readonly MERCHANT_ONBOARD_INITIATED = new KakfkaMerchantOnboardEventConstant('MERCHANT_ONBOARD_INITIATED', 'merchant-onboard-initiated', 'merchant-onboard-initiated-group', 'merchant-onboard-initiated');

    public static readonly MERCHANT_ONBOARD_APPROVED = new KakfkaMerchantOnboardEventConstant('MERCHANT_ONBOARD_APPROVED', 'merchant-onboard-approved', 'merchant-onboard-approved-group', 'merchant-onboard-approved');

    public static readonly MERCHANT_PAYMENTPOINTS_MANAGED = new KakfkaMerchantOnboardEventConstant('MERCHANT_PAYMENTPOINTS_MANAGED', 'merchant-paymentpoints-managed', 'merchant-paymentpoints-managed-group', 'merchant-paymentpoints-managed');

    private readonly TOPIC_PREFIX = process.env.DEPLOYMENT_NAMESPACE ? `${ process.env.DEPLOYMENT_NAMESPACE }_` : '';

    constructor (public readonly name: string, public readonly topicName: string, public readonly groupId: string, public readonly key: string) {
        super(name);
        this.topicName = topicName;
        this.groupId = groupId;
        this.key = key;
    }

    public static getValues(): KakfkaMerchantOnboardEventConstant[] {
        return [
            this.MERCHANT_ENROLLED,
            this.MERCHANT_ONBOARD_INITIATED,
            this.MERCHANT_ONBOARD_APPROVED,
            this.MERCHANT_PAYMENTPOINTS_MANAGED
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