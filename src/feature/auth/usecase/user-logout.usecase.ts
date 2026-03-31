import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { toKey, UserPoolService } from "@app/core/cache/user-pool.service";
import { Inject } from "@nestjs/common";
import { UserLogoutUsecaseResponse } from "./response/user-logout.usecase.response";
import { UserLogoutUsecaseRequest } from "./request/user-logout.usecase.request";
import { CacheFactory } from "@app/core/cache/cache.factory";

export class UserLogoutUsecase
	implements Usecase<UserLogoutUsecaseRequest, UserLogoutUsecaseResponse> {
	constructor (
		@Inject(UserPoolService)
		private userPoolService: UserPoolService,
		private cacheFactory: CacheFactory
	) { }

	async execute(
		_request: UserLogoutUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<UserLogoutUsecaseResponse>> {
		this.userPoolService.revokeSession(
			requestContext.getCurrentUser().userId,
			requestContext.getCurrentUser().clientCode
		);

		const response = new UserLogoutUsecaseResponse(true);
		return Result.createSuccess(response);
	}
}
