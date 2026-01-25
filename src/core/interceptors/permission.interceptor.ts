// import { PermissionsCheckerService } from "@app/feature/auth/services/permissions-checker.service";
import { Result } from "@app/feature/common/result";
import {
	CallHandler,
	ExecutionContext,
	ForbiddenException,
	Global,
	Injectable,
	Logger,
	NestInterceptor,
} from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { Observable } from "rxjs";
import { PermissionsConstant } from "../constants/permissions.constant";
import { RequestContext } from "../middleware/request_context";
import { PermissionsCheckerService } from "@app/feature/auth/services/permissions-checker.service";

@Global()
@Injectable()
export class PermissionInterceptor implements NestInterceptor {
	constructor(
		private readonly als: AsyncLocalStorage<RequestContext>,
		private readonly permissionsService: PermissionsCheckerService
	) {}
	async intercept(
		context: ExecutionContext,
		next: CallHandler
	): Promise<Observable<any>> {
		const originalUrl = context
			.switchToHttp()
			.getRequest()
			.url.replace(/^(\/)?v1|\/$/g, "");
		if (originalUrl.includes("/auth/login")) {
			return next.handle();
		} else {
			const method = context.switchToHttp().getRequest().method;
			const urlPermissions =
				PermissionsConstant.getPermissionsByEndpointAndMethod(
					originalUrl,
					method
				);
			let authorized:boolean;
			if (urlPermissions && urlPermissions.length == 0) {
				return next.handle();
			} else {
				try {
					const userId = this.als.getStore()["currentUser"]?.loginId;
					authorized = await this.permissionsService.execute(
						userId,
						urlPermissions
					);
				} catch (error) {
					Logger.error("Authorize error", error);
				}
			}

			if (authorized) {
				return next.handle();
			} else {
				const response = {
					code: 403,
					message: "You don't have permission to access this page.",
					data: null,
					errors: "Forbidden",
				};
				Result.createErrorWithMessage(
					new ForbiddenException(response.message),
					response.errors
				);
			}
		}
	}
}
