import { UsecaseRequest } from "@app/core/usecase/usecase.request";
import { DynamicFiltersDto } from "@app/shared/dtos/filter-conditions.dto";

export class GetAuditLogsRequest implements UsecaseRequest {
	constructor(public readonly filters: DynamicFiltersDto) {}
}
