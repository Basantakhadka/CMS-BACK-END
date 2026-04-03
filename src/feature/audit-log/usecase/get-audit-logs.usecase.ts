import { Injectable } from "@nestjs/common";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { RequestContext } from "@app/core/middleware/request_context";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { AuditLogDbRepository } from "../repositories/db/audit-log.db-repository";
import { GetAuditLogsRequest } from "./request/get-audit-logs.usecase.request";
import { GetAuditLogsResponse } from "./response/get-audit-logs.usecase.response";
import { AuditLogResponseDto } from "../dtos/audit-log-list.dtos";

@Injectable()
export class GetAuditLogsUsecase
	implements Usecase<GetAuditLogsRequest, GetAuditLogsResponse>
{
	constructor(
		private readonly auditLogRepository: AuditLogDbRepository,
	) {}

	async execute(
		request: GetAuditLogsRequest,
		_requestContext?: RequestContext,
	): Promise<Result<GetAuditLogsResponse>> {
		const page = await this.auditLogRepository.findAllWithDynamicFilters(
			request.filters,
		);

		const auditLogsResponse: AuditLogResponseDto[] = [];
		const elements = page.getElements();

		elements.forEach((auditLog) => {
			const auditLogDto = new AuditLogResponseDto();
			auditLogDto.id = auditLog.id;
			auditLogDto.actorUserId = auditLog.actorUserId;
			auditLogDto.actorUserName = auditLog.actorUserName;
			auditLogDto.action = auditLog.action;
			auditLogDto.resourceType = auditLog.resourceType;
			auditLogDto.resourceId = auditLog.resourceId;
			auditLogDto.resourceLabel = auditLog.resourceLabel;
			auditLogDto.previousValue = auditLog.previousValue;
			auditLogDto.newValue = auditLog.newValue;
			auditLogDto.metadata = auditLog.metadata;
			auditLogDto.success = auditLog.success;
			auditLogDto.errorMessage = auditLog.errorMessage;
			auditLogDto.performedAt = auditLog.performedAt?.toISOString() ?? null;
			auditLogDto.clientCode = auditLog.clientCode;

			auditLogsResponse.push(auditLogDto);
		});

		const pageInfo = new PageInfoDto();
		pageInfo.current = page.getCurrentPage();
		pageInfo.size = page.getSize();
		pageInfo.sortInfo = page.getSortMetas() as any;

		const response = new GetAuditLogsResponse(
			auditLogsResponse,
			pageInfo
		);
		return Result.createSuccess(response);
	}
}

