import { CurrentUser } from "./current_user";

export class RequestContext {
	private currentUser: CurrentUser;
	// private jti: string;

	constructor (currentUser: CurrentUser) {
		this.currentUser = currentUser;
		// this.jti = jti;
	}

	getCurrentUser(): CurrentUser {
		return this.currentUser;
	}

	// getJti(): string {
	// 	return this.jti;
	// }
}
