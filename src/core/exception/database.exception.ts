import { HttpException } from "@nestjs/common";

export class DatabaseException extends HttpException {
	constructor(public message: string) {
		super(message, 503);
	}
}
