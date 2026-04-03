import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { DynamicFiltersDto } from "@app/shared/dtos/filter-conditions.dto";
import { GetAuditLogsUsecase } from "./usecase/get-audit-logs.usecase";
import { GetAuditLogsByUserUsecase, GetAuditLogsByUserRequest } from "./usecase/get-audit-logs-by-user.usecase";
import { GetAuditLogsRequest } from "./usecase/request/get-audit-logs.usecase.request";

@ApiTags("Audit Log")
@ApiBearerAuth()
@Controller("audit-log")
@UseInterceptors(PermissionInterceptor)
export class AuditLogController {
	constructor(
		private readonly getAuditLogsUsecase: GetAuditLogsUsecase,
		private readonly getAuditLogsByUserUsecase: GetAuditLogsByUserUsecase,
	) {}

	/**
	 * List all audit logs with dynamic filters and pagination.
	 * POST /audit-log/list
	 */
	@Post("list")
	async getAuditLogs(@Body() body: DynamicFiltersDto) {
		const request = new GetAuditLogsRequest(body);
		return this.getAuditLogsUsecase.execute(request);
	}

	/**
	 * List audit logs for a specific IAM user.
	 * POST /audit-log/iam-user/:userId/list
	 */
	@Post("iam-user/:userId/list")
	async getAuditLogsByUser(
		@Param("userId") userId: string,
		@Body() body: DynamicFiltersDto,
	) {
		const request = new GetAuditLogsByUserRequest(userId, body);
		return this.getAuditLogsByUserUsecase.execute(request);
	}
}
