import {Controller, Get, Inject, Req} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppService } from "CMS-BACK-END/src/app.service";
import AppLogger from "CMS-BACK-END/src/core/logger/AppLogger";
import { KafkaConnector } from "./core/kafka/producer/kafka-connector";

@ApiTags("nest_app")
@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly appLogger: AppLogger,
		private readonly kafkaConnector: KafkaConnector
	) {}

	@Get()
	getHello(): string {
		this.appLogger.log("API called");
		return this.appService.getHello();
	}

	@Get("/ping")
	ping(): object {
		this.appLogger.log("PING called");
		const logData = {
			kafkaStatus: this.kafkaConnector.getConnectionStatus(),
			applicationStatus: "Application running",
		};
		return logData;
	}

	@Get("/validate-token")
	async validateToken(@Req() request: Request) {
		const xsrfToken = request.headers['x-xsrf-token'] as string;
		if (!xsrfToken) {
			throw new Error("Missing XSRF Token");
		}

		// Pass the xsrfToken to the service for further validation
		return await this.appService.validateToken(xsrfToken);
	}
}
