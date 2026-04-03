import { BaseRepository } from "@app/core/repository/base.repository";
import { Page } from "@app/core/repository/search/page";
import { DynamicFiltersDto } from "@app/shared/dtos/filter-conditions.dto";
import { AuditLog } from "../entities/audit-log.entity";

export interface AuditLogRepository extends BaseRepository<AuditLog, string> {
	findAllWithDynamicFilters(filters: DynamicFiltersDto): Promise<Page<AuditLog>>;
	findByActorUserId(actorUserId: string, pageInfo?: any): Promise<Page<AuditLog>>;
}
