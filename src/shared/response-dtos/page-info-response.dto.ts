import { Filter } from "CMS-BACK-END/src/core/repository/search/filter";

export class PageInfoDto {
	current: number;
	target: number;
	size: number;
	state: StateInfoDto;
}
export class PaginationInfo {
	filters: Filter[];
	pageInfo: PageInfoDto;
	searchText: string;
	totalCount: number;
}
export class StateInfoDto{
    next:string[];
    previous:string[];
}