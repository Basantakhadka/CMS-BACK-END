import { UsecaseRequest } from "@app/core/usecase/usecase.request";
import { AuditAction } from "../../entities/audit-log.entity";

export class SaveAuditLogRequest implements UsecaseRequest {
	constructor(
		public readonly actorUserId: string,
		public readonly actorUserName: string,
		public readonly action: AuditAction,
		public readonly resourceType: string,
		public readonly resourceId: string,
		public readonly resourceLabel?: string,
		public readonly previousValue?: Record<string, any>,
		public readonly newValue?: Record<string, any>,
		public readonly metadata?: Record<string, any>,
		public readonly success: boolean = true,
		public readonly errorMessage?: string,
	) {}
}
