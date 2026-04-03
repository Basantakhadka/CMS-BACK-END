import { Inject, Injectable, Logger } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";
import { IdGenerator } from "@app/shared/id-generator";
import { AuditLog, AuditAction } from "./entities/audit-log.entity";
import { AuditLogDbRepository } from "./repositories/db/audit-log.db-repository";
import { AuditLogRepository } from "./repositories/audit-log.repository";

export interface AuditLogPayload {
	action: AuditAction;
	resourceType: string;
	resourceId: string;
	resourceLabel?: string;
	previousValue?: Record<string, any>;
	newValue?: Record<string, any>;
	metadata?: Record<string, any>;
	success?: boolean;
	errorMessage?: string;
}

/**
 * AuditLogService — the central saving mechanism.
 *
 * Inject this service anywhere in the application to persist an audit record.
 * Actor context (userId, userName, clientCode) is resolved automatically from
 * the AsyncLocalStorage request context so callers only need to describe the
 * operation itself.
 *
 * Usage:
 *   await this.auditLogService.log({
 *     action: AuditAction.CREATE,
 *     resourceType: 'User',
 *     resourceId: newUser.id,
 *     newValue: newUser,
 *   });
 */
@Injectable()
export class AuditLogService {
	private readonly logger = new Logger(AuditLogService.name);

	constructor(
		private readonly auditLogRepository: AuditLogDbRepository,
		private readonly als: AsyncLocalStorage<RequestContext>,
	) {}

	/**
	 * Persist an audit log entry. Failures are intentionally caught and logged
	 * so that a broken audit trail never affects the main request flow.
	 */
	async log(payload: AuditLogPayload): Promise<void> {
		try {
			const currentUser = this.als.getStore()?.getCurrentUser();
			const entry = new AuditLog();
			entry.id = IdGenerator.generateId();
			entry.actorUserId = currentUser?.userId ?? "system";
			entry.actorUserName = currentUser?.fullName ?? currentUser?.username ?? "system";
			entry.clientCode = currentUser?.clientCode ?? undefined;
			entry.action = payload.action;
			entry.resourceType = payload.resourceType;
			entry.resourceId = payload.resourceId;
			entry.resourceLabel = payload.resourceLabel ?? undefined;
			entry.previousValue = payload.previousValue ?? undefined;
			entry.newValue = payload.newValue ?? undefined;
			entry.metadata = payload.metadata ?? undefined;
			entry.success = payload.success ?? true;
			entry.errorMessage = payload.errorMessage ?? undefined;
			entry.performedAt = new Date();

			await this.auditLogRepository.insert(entry);
		} catch (err) {
			this.logger.error("Failed to persist audit log entry", (err as Error)?.stack);
		}
	}
}
