import { EnumType } from "../enum-type.constant";

export class KakfkaTransactionsEventConstant extends EnumType<KakfkaTransactionsEventConstant>{
    public static readonly TRANSACTIONS_PERFORMED = new KakfkaTransactionsEventConstant('TRANSACTIONS_PERFORMED', 'transactions-performed', 'transactions-performed-group', 'transactions-performed');
    public static readonly TRANSACTIONS_RECORDED = new KakfkaTransactionsEventConstant('TRANSACTIONS_RECORDED', 'transactions-recorded', 'transactions-recorded-group', 'txn-recorded');
    public static readonly ISSUERS_TRANSACTIONS_RECORDED = new KakfkaTransactionsEventConstant('issuers-transactions-recorded', 'issuers-transactions-recorded', 'issuers-transactions-recorded', 'issuers-txn-recorded');

    private readonly TOPIC_PREFIX = process.env.DEPLOYMENT_NAMESPACE ? `${ process.env.DEPLOYMENT_NAMESPACE }_` : '';

    constructor (public readonly name: string, public readonly topicName: string, public readonly groupId: string, public readonly key: string) {
        super(name);
        this.topicName = topicName;
        this.groupId = groupId;
        this.key = key;
    }

    public static getValues(): KakfkaTransactionsEventConstant[] {
        return [
            this.TRANSACTIONS_PERFORMED,
            this.TRANSACTIONS_RECORDED
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