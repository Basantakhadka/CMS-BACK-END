import { ConsumerKafkaTemplate } from "CMS-BACK-END/src/core/kafka/consumer/consumer-kafka-template";
import {
	logConsumedMessageSuccess,
	logConsumedMessageFailed,
} from "CMS-BACK-END/src/core/kafka/kafka-logger";
import { KafkaConnector } from "CMS-BACK-END/src/core/kafka/producer/kafka-connector";
import { EmailService } from "CMS-BACK-END/src/core/notification/notification.service";
import { Kakfka2FAEventConstant } from "CMS-BACK-END/src/shared/constants/event-constants/kafka-2fa-event.constant";
import { Inject, Injectable } from "@nestjs/common";
import { EachMessagePayload } from "kafkajs";

@Injectable()
export class MFAEmailConsumer extends ConsumerKafkaTemplate {
	constructor(
		@Inject(KafkaConnector)
		kafkaConnector: KafkaConnector,
		private readonly emailService: EmailService
	) {
		super(kafkaConnector);
	}
	getTopic(): string {
		return Kakfka2FAEventConstant.SEND_2FA_EMAIL.getTopicName();
	}
	getGroupId(): string {
		return `${Kakfka2FAEventConstant.SEND_2FA_EMAIL.getGroupId()}-email`;
	}

	async processEachMessage(payload: EachMessagePayload): Promise<void> {
		const message = JSON.parse(payload.message?.value?.toString());

		try {
			logConsumedMessageSuccess(this.getGroupId(), message);
			await this.emailService.sendEmail(message);
		} catch (error) {
			logConsumedMessageFailed(this.getGroupId(), error);
		}
	}
}
