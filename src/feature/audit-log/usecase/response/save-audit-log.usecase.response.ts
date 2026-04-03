import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { AuditLog } from "../../entities/audit-log.entity";

export class SaveAuditLogResponse implements UsecaseResponse {
	constructor(public readonly auditLog: AuditLog) {}
}
