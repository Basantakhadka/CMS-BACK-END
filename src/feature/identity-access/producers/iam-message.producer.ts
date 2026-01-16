import { logProducerRequestFailedMessage, logProducerRequestMessage } from "CMS-BACK-END/src/core/kafka/kafka-logger";
import { KafkaConnector } from "CMS-BACK-END/src/core/kafka/producer/kafka-connector";
import { KakfkaIamEventConstant } from "CMS-BACK-END/src/shared/constants/event-constants/kafka-iam-event.constant";
import { IMailOptions } from "CMS-BACK-END/src/shared/mailer/mailer-interfaces";
import { Inject, Injectable } from "@nestjs/common";

export interface IUserEmailMessage {
    emailProperties: IMailOptions;
    institutionCode: string;
}

@Injectable()
export class IamMessageProducer {
    constructor (
        @Inject(KafkaConnector) private readonly kafkaConnector: KafkaConnector
    ) { }

    public produceUserEmailMessage(message: IUserEmailMessage): void {
        const topic = KakfkaIamEventConstant.USER_SEND_EMAIL.getTopicName();
        const key = KakfkaIamEventConstant.USER_SEND_EMAIL.getKey();
        try {
            logProducerRequestMessage(topic, message);
            this.kafkaConnector.sendMessage(topic, JSON.stringify(message), key);
        } catch (error) {
            logProducerRequestFailedMessage(topic, error);
        }
    }
}