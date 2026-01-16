import { Logger, OnModuleInit } from "@nestjs/common";
import { Consumer, EachMessagePayload } from "kafkajs";
import { KafkaConnector } from "../producer/kafka-connector";
import { logConnectAndSubscribeConsumerFailed } from "../kafka-logger";

enum kafkajsErrorEnum {
	RETRIES_EXCEEDED = 'KafkaJSNumberOfRetriesExceeded'
}

export abstract class ConsumerKafkaTemplate implements OnModuleInit {
	protected consumer: Consumer;
	protected kafkaConnector: KafkaConnector;
	protected lastHeartbeat: Date;
	protected isConnected: boolean = false;

	constructor(kafkaConnectorParam: KafkaConnector) {
		this.kafkaConnector = kafkaConnectorParam;
	}

	abstract getTopic(): string;
	abstract getGroupId(): string;
	abstract processEachMessage(payload: EachMessagePayload): Promise<void>;

	async onModuleInit() {
		try {
			this.consumer = this.kafkaConnector.getKafka().consumer({
				groupId: this.getGroupId(),
			});

			console.log(
				`Consumer group ${JSON.stringify(await this.consumer.describeGroup())}`
			);

			const { CONNECT, DISCONNECT, CRASH, GROUP_JOIN, HEARTBEAT } =
				this.consumer.events;

			this.consumer.on(CONNECT, (e) => {
				Logger.log(
					`Connected to topic ${this.getTopic()}: \n ${JSON.stringify(e)}`,
					this.getGroupId()
				);
				this.isConnected = true;
			});

			this.consumer.on(DISCONNECT, (e) => {
				Logger.log(
					`Consumer ${this.getGroupId()} is disconnected: \n ${JSON.stringify(
						e
					)}`
				);
				this.isConnected = false;
			});

			this.consumer.on(CRASH, (e) => {
				Logger.log(
					`Consumer ${this.getGroupId()} is crashed: \n ${JSON.stringify(e)} `
				);
			});

			// listen to heartbeat
			this.consumer.on(HEARTBEAT, (e) => {
				this.lastHeartbeat = new Date();
				this.startHeartbeatCheck();
			});

			this.consumer.on(GROUP_JOIN, (e) => {
				Logger.log(
					`Consumer ${this.getGroupId()} group joined: \n ${JSON.stringify(e)}`
				);
			});

			await this.connectAndSubscribeConsumer();
		} catch (error) {
			console.error("Consumer initialization error", error);
		}
	}

	private async connectAndSubscribeConsumer(): Promise<void> {
		try {
			if (!this.isConnected) {
				await this.consumer.connect();
				if (this.isConnected) {
					await this.consumer.subscribe({
						topics: [this.getTopic()],
						fromBeginning: false,
					});
					Logger.log(
						`Successfully subscribed to topic: ${this.getTopic()}`,
						this.getGroupId()
					);
					await this.runConsumer();
				}
			}
		} catch (error) {
			logConnectAndSubscribeConsumerFailed(error);
		}
	}

	private async runConsumer(): Promise<void> {
		await this.consumer.run({
			eachMessage: async (payload) => {
				try {
					this.logMessageValue(
						`partition: ${payload?.partition?.toString()} -->` +
							payload?.message?.value?.toString()
					);
					await this.processEachMessage(payload);
				} catch (error) {
					console.error("Error while running consume", error.message);
				}
			},
		});
	}

	private logMessageValue(value: string | undefined): void {
		try {
			Logger.log(`Processing message by group: ${this.getGroupId()}`, value);
		} catch (error) {
			console.log("Error while logging message value", error);
		}
	}

	private async disconnectConsumer(): Promise<void> {
		await this.consumer.disconnect();
	}

	//To-do in future
	private async crashHandler(error: any) {
		// This logic is based on kafkajs implementation: https://github.com/tulios/kafkajs/blob/master/src/consumer/index.js#L257
		if (
			error &&
			error.name !== kafkajsErrorEnum.RETRIES_EXCEEDED &&
			!error.retriable
		) {
			await this.restartConsumer();
		}
	}

	private startHeartbeatCheck() {
		const heartbeatCheckInterval =
			+process.env.KAFKA_HEARTBEAT_CHECK_INTERVAL || 10000;
		const refreshInterval = setInterval(() => {
			const now = new Date();

			if (
				now.getTime() - (this.lastHeartbeat?.getTime() || 0) >
				heartbeatCheckInterval
			) {
				Logger.log(
					`Heartbeat is lost. Last heartbeat was at ${this.lastHeartbeat}`,
					this.getGroupId()
				);

				clearInterval(refreshInterval);

				// restart consumer
				(async () => {
					await this.restartConsumer();
				})();
			}
		}, heartbeatCheckInterval);
	}

	private async restartConsumer() {
		try {
			const timeout = 4000;

			// Disconnect the current consumer
			await this.disconnectConsumer();
			await new Promise((resolve) => setTimeout(resolve, timeout));

			if (!this.isConnected) {
				// Reconnect and subscribe to the consumer
				await this.connectAndSubscribeConsumer();
			}
		} catch (error) {
			logConnectAndSubscribeConsumerFailed(error);
		}
	}
}
