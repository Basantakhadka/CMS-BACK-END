import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";
import { KafkaConnectionStatus } from "../kafka-connection-status";
import {
	logProducedMessageFailed,
	logProducedMessageMetadataSuccess,
	logProducedMessageProcess
} from "../kafka-logger";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";
@Injectable()
export class KafkaConnector implements OnModuleInit, OnModuleDestroy {
	private kafka: Kafka;
	private producer: Producer;
	private connectionStatus = KafkaConnectionStatus.DISCONNECTED;

	constructor () {
		try {
			// Initialize Kafka client
			//TODO SASL Commented. Will be used  in future
			this.kafka = new Kafka({
				brokers: [process.env.KAFKA_BROKER],
				clientId: IdGenerator.generateId("4"),
				retry: {
					retries: +process.env.KAFKA_INITIALIZE_RETRY,
				}
				// sasl: {
				// 	mechanism: 'plain',
				// 	username: process.env.KAFKA_USERNAME,
				// 	password: process.env.KAFKA_PASSWORD,}
			}
			
			);
			// Initialize producer
			this.producer = this.kafka.producer();
		} catch (error) {
			console.log("Failed to initialize kafka", error);
		}
	}

	async onModuleInit() {
		const { CONNECT, DISCONNECT } = this.producer.events;

		try {
			this.producer.on(CONNECT, (e) => {
				this.connectionStatus = KafkaConnectionStatus.CONNECTED;
				Logger.log(`Producer is connected: \n ${ JSON.stringify(e) }`);
			});

			this.producer.on(DISCONNECT, (e) => {
				this.connectionStatus = KafkaConnectionStatus.DISCONNECTED;
				Logger.log(`Producer is disconnected: \n ${ JSON.stringify(e) }`);
			});

			await this.producer.connect();
		} catch (error) {
			console.log("Error", error);
			this.connectionStatus = KafkaConnectionStatus.DISCONNECTED;
		}
	}

	async onModuleDestroy(): Promise<void> {
		// Disconnect producer
		await this.producer.disconnect();
	}

	async sendMessage(
		topic: string,
		message: string,
		key?: string
	): Promise<void> {
		logProducedMessageProcess(topic, JSON.parse(message));
		try {
			// Send message
			const sendMetadata = await this.producer.send({
				topic,
				messages: [
					key
						? {
							key: key,
							value: message,
						}
						: {
							value: message,
						},
				],
			});
			logProducedMessageMetadataSuccess(JSON.stringify(sendMetadata));
		} catch (error) {
			logProducedMessageFailed(topic, error);
		}
	}

	getConnectionStatus(): KafkaConnectionStatus {
		return this.connectionStatus;
	}

	getKafka() {
		return this.kafka;
	}
}
