import {
	logProducerRequestFailedMessage,
	logProducerRequestMessage,
} from "CMS-BACK-END/src/core/kafka/kafka-logger";
import { KafkaConnector } from "CMS-BACK-END/src/core/kafka/producer/kafka-connector";
import { Kakfka2FAEventConstant } from "CMS-BACK-END/src/shared/constants/event-constants/kafka-2fa-event.constant";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AuthMessageProducer {
	constructor(
		@Inject(KafkaConnector) private readonly kafkaConnector: KafkaConnector
	) {}

	public produce2faAuthEmail(message): void {
		const topic = Kakfka2FAEventConstant.SEND_2FA_EMAIL.getTopicName();
		const key = Kakfka2FAEventConstant.SEND_2FA_EMAIL.getKey();
		try {
			logProducerRequestMessage(topic, message);
			this.kafkaConnector.sendMessage(topic, JSON.stringify(message), key);
		} catch (error) {
			logProducerRequestFailedMessage(topic, error);
		}
	}
}
