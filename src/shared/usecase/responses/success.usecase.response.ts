import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";

export class SuccessUsecaseResponse implements UsecaseResponse {
	constructor(public success: boolean) {}
}
