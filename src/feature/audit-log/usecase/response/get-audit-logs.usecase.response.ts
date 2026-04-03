import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { AuditLogResponseDto } from "../../dtos/audit-log-list.dtos";

export class GetAuditLogsResponse implements UsecaseResponse {
	constructor(
		public list: AuditLogResponseDto[],
		public pageInfo: PageInfoDto
	) {}
}
