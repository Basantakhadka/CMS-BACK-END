import { ConsumerKafkaTemplate } from "CMS-BACK-END/src/core/kafka/consumer/consumer-kafka-template";
import { logConsumedMessageFailed, logConsumedMessageSuccess } from "CMS-BACK-END/src/core/kafka/kafka-logger";
import { KafkaConnector } from "CMS-BACK-END/src/core/kafka/producer/kafka-connector";
import { Inject, Injectable } from "@nestjs/common";
import { EachMessagePayload } from "kafkajs";
import { IUserEmailMessage } from "../producers/iam-message.producer";
import { UserSendEmailService } from "../services/user-send-email.service";
import { KakfkaIamEventConstant } from "CMS-BACK-END/src/shared/constants/event-constants/kafka-iam-event.constant";

@Injectable()
export class UserSendEmailConsumer extends ConsumerKafkaTemplate {
	constructor(
		@Inject(KafkaConnector)
		kafkaConnector: KafkaConnector,
		@Inject(UserSendEmailService)
		private readonly userSendEmailService: UserSendEmailService
	) {
		super(kafkaConnector);
	}
	getTopic(): string {
		return KakfkaIamEventConstant.USER_SEND_EMAIL.getTopicName();
	}
	getGroupId(): string {
		return `${KakfkaIamEventConstant.USER_SEND_EMAIL.getGroupId()}-email`;
	}

	async processEachMessage(payload: EachMessagePayload): Promise<void> {
		const originalMsg: IUserEmailMessage = JSON.parse(
			payload.message?.value?.toString()
		);

		try {
			logConsumedMessageSuccess(this.getGroupId(), originalMsg);
			await this.userSendEmailService.sendEmailToCreatedUser(originalMsg);
		} catch (error) {
			logConsumedMessageFailed(this.getGroupId(), error);
		}
	}
}