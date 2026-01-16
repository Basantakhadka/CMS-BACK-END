import { Result } from "@app/feature/common/result";
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	Logger,
	HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class ErrorHandler implements ExceptionFilter {
	private readonly logger: Logger;
	constructor() {
		this.logger = new Logger("EXCEPTION");
	}

	catch(exception: any, host: ArgumentsHost) {
		console.log("APP EXCEPTION", exception);
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let code: number | string, message: any, data: any;
		if (exception instanceof HttpException) {
			code = exception.getStatus();
			message = exception.message;
			data = { message: exception.message };
		} else if (exception instanceof Result) {
			const error = exception.errors[0] as any;
			code = exception.code;
			message = exception.message;
			data = { message: error.response.message };
			const statusCode =
				error.response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
			return response.status(statusCode).json({
				code,
				message,
				data,
			});
		} else {
			code = HttpStatus.INTERNAL_SERVER_ERROR;
			message = "INTERNAL SERVER ERROR";
			data = { message: "Unexpected system error occurred" };
		}

		this.logger.error({ code, message });

		response.status(code).json({
			code,
			message,
			data,
		});
	}
}
