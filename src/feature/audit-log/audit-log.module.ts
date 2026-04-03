import { Module } from "@nestjs/common";
import { AuthModule } from "@app/feature/auth/auth.module";
import { AuditLogController } from "./audit-log.controller";
import { AuditLogService } from "./audit-log.service";
import { AuditLogDbRepository } from "./repositories/db/audit-log.db-repository";
import { GetAuditLogsUsecase } from "./usecase/get-audit-logs.usecase";
import { GetAuditLogsByUserUsecase } from "./usecase/get-audit-logs-by-user.usecase";
import { SaveAuditLogUsecase } from "./usecase/save-audit-log.usecase";

@Module({
	imports: [AuthModule],
	controllers: [AuditLogController],
	providers: [
		AuditLogDbRepository,
		AuditLogService,
		SaveAuditLogUsecase,
		GetAuditLogsUsecase,
		GetAuditLogsByUserUsecase,
	],
	/**
	 * Export AuditLogService so any feature module can inject it and call
	 * auditLogService.log({ ... }) to save a record without importing the full module.
	 */
	exports: [AuditLogService],
})
export class AuditLogModule {}
