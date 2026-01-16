import { PageInfoDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CustomQueryHelper } from "./custom-query-helper";
import { Filter } from "./filter";
import { PageInfo } from "./page.info";
import { PageImpl } from "./pageImpl";
import { DynamicQueryBuilder } from "./query-builder";
import { SortMeta } from "./sort.meta";
import { MapSnakeCaseToCamelCase, MapSnakeCaseToCamelCaseWithFieldMap } from "@app/feature/common/mapper";
import { Logger } from "@nestjs/common";

export interface PaginationOptions {
	columnsMap: Map<string, string> | null;
	defaultSortMeta: SortMeta;
	filters?: Filter[];
	columns?: string[];
	groupBy?: string;
}
export class Pagination<T> {
	constructor(private repository: Repository<T>, private pageInfo: PageInfo) {}

	public async paginate(
		queryBuilder: SelectQueryBuilder<T>,
		options: PaginationOptions
	) {
		const filters = options.filters?.length ? options.filters : [];

		if (!this.pageInfo) {
			this.pageInfo = new PageInfoDto();
			this.pageInfo.current = 1;
			this.pageInfo.target = 2;
			this.pageInfo.size = 10;
			this.pageInfo.sortInfo = [];
			this.pageInfo.state = { next: [], previous: [] };
		}
		const dynamicQueryBuilder = new DynamicQueryBuilder<T>(queryBuilder);
		const builder = CustomQueryHelper.prepareQuery(
			dynamicQueryBuilder,
			options.columnsMap,
			options.defaultSortMeta,
			filters,
			this.pageInfo,
			options.groupBy
		);
		Logger.log("PAGINATION QUERY ====>", builder.getQueryAndParameters());
		let [list, count] = await builder.getManyAndCount();
		if (!list?.length) {
			list = MapSnakeCaseToCamelCase(await builder.getRawMany());
		}
		let pageInfo: PageInfo = new PageInfoDto();
		if (list?.length) {
			pageInfo = CustomQueryHelper.preparePageInfo(
				options.defaultSortMeta,
				list[list.length - 1],
				this.pageInfo
			);
			if ((count && count <= pageInfo.size) || list?.length < pageInfo.size) {
				pageInfo.state.next = [];
			}
		} else {
			pageInfo.current = this.pageInfo.current;
			pageInfo.size = this.pageInfo.size;
			pageInfo.target = this.pageInfo.target;
			pageInfo.sortInfo = this.pageInfo.sortInfo || [];
			pageInfo.state = this.pageInfo.state;
		}
		let page = new PageImpl<T>(
			null,
			pageInfo?.current,
			pageInfo?.target,
			pageInfo.size,
			pageInfo.state,
			null,
			list,
			null
		);
		return page;
	}

	public async paginateWIthQuery(query: string, options: PaginationOptions) {
		const filters = options.filters?.length ? options.filters : null;
		if (!this.pageInfo) {
			this.pageInfo = new PageInfoDto();
			this.pageInfo.current = 1;
			this.pageInfo.target = 2;
			this.pageInfo.size = 10;
			this.pageInfo.sortInfo = [];
			this.pageInfo.state = { next: [], previous: [] };
		}

		query = CustomQueryHelper.prepareQueryWithBaseQuery(
			query,
			options.columnsMap,
			options.defaultSortMeta,
			filters,
			this.pageInfo,
			options.groupBy
		);

		const result = await this.repository.query(query);
		const list = MapSnakeCaseToCamelCaseWithFieldMap(
			result,
			options.columnsMap
		);
		let pageInfo: PageInfo = new PageInfoDto();
		if (list?.length) {
			pageInfo = CustomQueryHelper.preparePageInfo(
				options.defaultSortMeta,
				list[list.length - 1],
				this.pageInfo
			);
			if (list.length < pageInfo.size) {
				pageInfo.state.next = [];
			}
		} else {
			pageInfo.current = this.pageInfo.current;
			pageInfo.size = this.pageInfo.size;
			pageInfo.target = this.pageInfo.target;
			pageInfo.sortInfo = this.pageInfo.sortInfo || [];
			pageInfo.state = this.pageInfo.state;
		}
		let page = new PageImpl<T>(
			null,
			pageInfo?.current,
			pageInfo?.target,
			pageInfo.size,
			pageInfo.state,
			null,
			list,
			null
		);
		return page;
	}
}
