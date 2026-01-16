import { EnumType } from "../enum-type.constant";

export class Kakfka2FAEventConstant extends EnumType<Kakfka2FAEventConstant> {
	public static readonly SEND_2FA_EMAIL = new Kakfka2FAEventConstant(
		"SEND_2FA_EMAIL",
		"member-2fa-send-email",
		"member-2fa-send-email-group",
		"2fa-email-notification"
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

	public static getValues(): Kakfka2FAEventConstant[] {
		return [this.SEND_2FA_EMAIL];
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
