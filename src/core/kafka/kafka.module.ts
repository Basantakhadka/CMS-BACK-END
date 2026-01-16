import { Global, Module } from "@nestjs/common";
import { KafkaConnector } from "./producer/kafka-connector";

@Global()
@Module({
	imports: [],
	providers: [KafkaConnector],
	exports: [KafkaConnector],
})
export class KafkaModule {}
