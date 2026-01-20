import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "@app/app.module";
import coreBootstrap from "@app/core/bootstrap";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);
	const PORT = config.get("app.port");

	// If the environment is dev/local/staging, then only swagger will be enabled


	// core bootstrap
	// config, environment, pipe, guards, intereceptors
	coreBootstrap(app);

	await app.listen(PORT, () => {
		console.log(`Listening on ::${ PORT }`);
	});
}
bootstrap();
