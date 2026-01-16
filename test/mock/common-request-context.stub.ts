import { CurrentUser } from "CMS-BACK-END/src/core/middleware/current_user";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";

export const currentUserStub = () => {
	return new CurrentUser(
		"3e78f4f0-2a35-443d-8f70-4ca331d90432",
		"maker@getpay.com",
		"Maker User",
		"111",
		"institution_111",
		"maker@getpay.com",
		["ISSUER", "ACQUIRER"]
	);
};

export const requestContextStub = () => {
	return new RequestContext(currentUserStub(), "");
};
