import { INestApplication, ValidationPipe } from "@nestjs/common";
import compression from "compression";
import cors from "cors";
import { json, urlencoded } from "express";
import helmet from "helmet";

import { shouldCompress } from "@app/core/compression/compression";
import { corsOptions } from "@app/core/cors.config";
import {
	ErrorHandler,
	RequestHandler,
	ResponseHandler,
} from "@app/core/middleware";

import { RequestContextMiddleware } from "./middleware/RequestContextMiddleware";
import { AuthTokenStrategy } from "./auth/authtoken.strategy";
import { CustomValidationPipe } from "./pipes/custom-validation-pipe";
import { UserPoolService } from "./cache/user-pool.service";
import { CacheFactory } from "./cache/cache.factory";

/**
 * Core bootstrap module should be loaded here.
 * @param app
 */
export default async function bootstrap(app: INestApplication) {
	// Global Prefix
	app.setGlobalPrefix("v1");

	// middlewares, express specific
	app.use(json({ limit: "50mb" }));
	app.use(urlencoded({ limit: "50mb", extended: true }));
	app.use(helmet());
	app.use(
		compression({
			filter: shouldCompress,
			threshold: 0,
		})
	);

	// CORS configuration
	app.use(cors(corsOptions));

	// Auto-validation
	app.useGlobalPipes(new CustomValidationPipe());

	// Get UserPoolService from the app context
	const userPoolService = app.get(UserPoolService);

	const cacheFactory = app.get(CacheFactory);

	// Bind Interceptors
	app.useGlobalInterceptors(
		new RequestHandler(),
		new ResponseHandler(userPoolService, cacheFactory)
	);

	// Error Handler
	app.useGlobalFilters(new ErrorHandler());
}
