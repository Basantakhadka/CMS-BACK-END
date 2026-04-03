import { Injectable, Logger } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { IdGenerator } from "@app/shared/id-generator";
import { AuditLog } from "../entities/audit-log.entity";
import { AuditLogDbRepository } from "../repositories/db/audit-log.db-repository";
import { SaveAuditLogRequest } from "./request/save-audit-log.usecase.request";
import { SaveAuditLogResponse } from "./response/save-audit-log.usecase.response";

@Injectable()
export class SaveAuditLogUsecase
	implements Usecase<SaveAuditLogRequest, SaveAuditLogResponse>
{
	private readonly logger = new Logger(SaveAuditLogUsecase.name);

	constructor(
		private readonly auditLogRepository: AuditLogDbRepository,
		private readonly als: AsyncLocalStorage<RequestContext>,
	) {}

	async execute(
		request: SaveAuditLogRequest,
		requestContext?: RequestContext,
	): Promise<Result<SaveAuditLogResponse>> {
		const ctx = requestContext ?? this.als.getStore();
		const clientCode = ctx?.getCurrentUser()?.clientCode;

		const entry = new AuditLog();
		entry.id = IdGenerator.generateId();
		entry.actorUserId = request.actorUserId;
		entry.actorUserName = request.actorUserName;
		entry.clientCode = clientCode ?? undefined;
		entry.action = request.action;
		entry.resourceType = request.resourceType;
		entry.resourceId = request.resourceId;
		entry.resourceLabel = request.resourceLabel ?? undefined;
		entry.previousValue = request.previousValue ?? undefined;
		entry.newValue = request.newValue ?? undefined;
		entry.metadata = request.metadata ?? undefined;
		entry.success = request.success ?? true;
		entry.errorMessage = request.errorMessage ?? undefined;
		entry.performedAt = new Date();

		const saved = await this.auditLogRepository.insert(entry);

		return Result.createSuccess(new SaveAuditLogResponse(saved ?? entry));
	}
}
