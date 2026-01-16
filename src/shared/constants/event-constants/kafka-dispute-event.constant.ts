import { EnumType } from "../enum-type.constant";

export class KakfkaDisputeEventConstant extends EnumType<KakfkaDisputeEventConstant> {
	public static readonly DISPUTE_SEND_EMAIL = new KakfkaDisputeEventConstant(
		"DISPUTE_SEND_EMAIL",
		"member-dispute-send-email",
		"member-dispute-send-email-group",
		"dispute-email-notification"
	);
	public static readonly DISPUTE_RECORDED = new KakfkaDisputeEventConstant(
		"DISPUTE_RECORDED",
		"dispute-recorded",
		"dispute-recorded-group",
		"dispute-recorded"
	);
	public static readonly ISSUERS_DISPUTE_RECORDED =
		new KakfkaDisputeEventConstant(
			"ISSUERS_DISPUTE_RECORDED",
			"issuers-dispute-recorded",
			"issuers-dispute-recorded-group",
			"issuers-dispute-recorded"
		);
	public static readonly DISPUTE_REJECTED = new KakfkaDisputeEventConstant(
		"DISPUTE_REJECTED",
		"dispute-rejected",
		"dispute-rejected-group",
		"dispute-rejected"
	);

	private readonly TOPIC_PREFIX = process.env.DEPLOYMENT_NAMESPACE
		? `${process.env.DEPLOYMENT_NAMESPACE}_`
		: "";

	constructor(
		public readonly name: string,
		public readonly topicName: string,
		public readonly groupId: string,
		public readonly key: string
	) {
		super(name);
		this.topicName = topicName;
		this.groupId = groupId;
		this.key = key;
	}

	public static getValues(): KakfkaDisputeEventConstant[] {
		return [
			this.DISPUTE_SEND_EMAIL,
			this.DISPUTE_RECORDED,
			this.ISSUERS_DISPUTE_RECORDED,
			this.DISPUTE_REJECTED,
		];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
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
