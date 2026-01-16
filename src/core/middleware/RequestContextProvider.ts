import { RequestContext } from "./request_context";

export class RequestContextProvider {
	constructor() {}
	private requestContext: RequestContext;

	get(): RequestContext {
		return this.requestContext;
	}

	set(requestContext: any) {
		this.requestContext = requestContext;
	}

	getCurrentUser() {
		return this.requestContext.getCurrentUser();
	}
}
