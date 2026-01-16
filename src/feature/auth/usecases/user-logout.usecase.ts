import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import {toKey, UserPoolService} from "CMS-BACK-END/src/core/cache/user-pool.service";
import { Inject } from "@nestjs/common";
import { UserLogoutUsecaseResponse } from "./response/user-logout.usecase.response";
import { UserLogoutUsecaseRequest } from "./request/user-logout.usecase.request";
import { CacheFactory } from "CMS-BACK-END/src/core/cache/cache.factory";

export class UserLogoutUsecase
	implements Usecase<UserLogoutUsecaseRequest, UserLogoutUsecaseResponse>
{
	constructor(
		@Inject(UserPoolService)
		private userPoolService: UserPoolService,
		private cacheFactory: CacheFactory
	) {}

	async execute(
		_request: UserLogoutUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<UserLogoutUsecaseResponse>> {
			this.userPoolService.revokeSession(
				requestContext.getCurrentUser().userId,
				requestContext.getCurrentUser().institutionCode
			);
			this.userPoolService.deleteSession(requestContext.getJti());



		let deletedKeyCheck=await this.cacheFactory.getCachedData(requestContext.getJti());
		console.log("CACHE CHECK:::",deletedKeyCheck)
		const response = new UserLogoutUsecaseResponse(true);
		return Result.createSuccess(response);
	}
}
