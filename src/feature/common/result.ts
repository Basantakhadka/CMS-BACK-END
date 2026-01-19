export class Result<T> {
	code: string;
	message: string;
	data: T;
	errors: Error[];

	constructor(code: string, message: string, data: T, errors: Error[]) {
		this.code = code;
		this.message = message;
		this.data = data;
		this.errors = errors;
	}

	isSuccess() {
		return !this.errors || this.errors.length == 0;
	}

	static createSuccess(data: any): Result<any> {
		return new Result("0", "SUCCESS", data, []);
	}

	static createSuccessWithMessage(data: any, message: string): Result<any> {
		return new Result("0", message, data, []);
	}

	static createError(error: Error): Result<any> {
		throw new Result("-1", "ERROR", null, [error]);
	}

	static createErrorWithMessage(error: Error, message: string): Result<any> {
		throw new Result("-1", message, null, [error]);
	}
}
