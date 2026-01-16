import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class RequestHandler implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();

		const inputs = [request.query, request.body, request.params];

		Logger.log(request.method, "METHOD");
		Logger.log(request.originalUrl, "ENDPOINT");

		if (Object.keys(request.query).length !== 0) {
			Logger.log(request.query, "QUERY-PARAMS");
		}


		if (Object.keys(request.params).length !== 0) {
			Logger.log(request.params, "PARAMS");
		}

		for (const input of inputs) {
			for (const key in input) {
				const value = input[key];
				if (typeof value === "string" || value instanceof String) {
					input[key] = value.trim();
				}
			}
		}
		return next.handle();
	}
}
