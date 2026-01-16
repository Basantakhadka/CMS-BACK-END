import { StringUtils } from "CMS-BACK-END/src/shared/utils/string-utils";
import { Filter } from "./filter";
import { PageInfo } from "./page.info";
import { DynamicQueryBuilder } from "./query-builder";
import { SortMeta, SortOrder } from "./sort.meta";
import { FilterCondition } from "CMS-BACK-END/src/shared/constants/filter-condition.constant";

export class CustomQueryHelper {
	static prepareQuery(
		queryBuilder: DynamicQueryBuilder<any>,
		columnsMap: Map<string, string>,
		defaultSortMeta: SortMeta,
		filters: Filter[],
		pageInfo: PageInfo,
		groupBy?: string
	) {
		//SET CRITERIA AND ORDER FOR PAGINATION
		const encodedNextState = pageInfo?.state?.next[0];
		const decodedNextState = encodedNextState
			? Buffer.from(encodedNextState, "hex").toString("utf-8")
			: "";

		let clusterFilters = "";
		const defaultSortCols = defaultSortMeta.field
			.split(",")
			.map(
				(item) =>
					`${
						columnsMap != null && columnsMap.get(item)
							? columnsMap.get(item)
							: StringUtils.camelToSnake(item)
					}`
			)
			.join(" , ");

		if (decodedNextState) {
			const offsetValues = decodedNextState;
			if (defaultSortMeta.order == SortOrder.DESC) {
				clusterFilters = `(${defaultSortCols}) < (${offsetValues})`;
			} else {
				clusterFilters = `(${defaultSortCols}) > (${offsetValues})`;
			}
		}

		let builder = queryBuilder.applyFilters(filters);
		if (clusterFilters) {
			builder.andWhere(clusterFilters);
		}
		builder
			.addOrderBy(
				StringUtils.camelToSnake(defaultSortMeta.field.split(",")[0]),
				defaultSortMeta.order
			)
			.addOrderBy(
				StringUtils.camelToSnake(defaultSortMeta.field.split(",")[1]),
				defaultSortMeta.order
			)
			.limit(pageInfo.size);

		return builder;
	}

	static prepareQueryWithoutBuilder(
		query: string,
		columnsMap: Map<string, string>,
		defaultSortMeta: SortMeta,
		filters: Filter[],
		pageInfo: PageInfo,
		groupBy?: string
	): string {
		//SET CRITERIA AND ORDER FOR PAGINATION
		let encodedNextState: string;
		let decodedNextState: string;
		if (pageInfo) {
			encodedNextState = pageInfo?.state?.next[0];
			decodedNextState = encodedNextState
				? Buffer.from(encodedNextState, "hex").toString("utf-8")
				: "";
		}

		let clusterFilters = "";
		let clusterOrders = "";
		const defaultSortCols = defaultSortMeta.field
			.split(",")
			.map(
				(item) =>
					`${
						columnsMap != null && columnsMap.get(item)
							? columnsMap.get(item)
							: StringUtils.camelToSnake(item)
					}`
			)
			.join(" , ");

		if (decodedNextState) {
			const offsetValues = decodedNextState;
			if (defaultSortMeta.order == SortOrder.DESC) {
				clusterFilters = ` AND (${defaultSortCols}) < (${offsetValues})`;
			} else {
				clusterFilters = ` AND (${defaultSortCols}) > (${offsetValues})`;
			}
		}
		clusterOrders = `(${defaultSortCols}) ${defaultSortMeta.order}`;

		//SET PAGE LIMIT]
		let filterExpression = filters
			? FilterCondition.buildFilterExpressionAndPrepend(filters)
			: "";

		if (pageInfo) {
			query =
				query +
				clusterFilters +
				filterExpression +
				groupBy +
				" ORDER BY " +
				clusterOrders +
				" LIMIT " +
				pageInfo.size;
		} else {
			query = query + groupBy + clusterFilters + filterExpression;
		}
		return query;
	}

	static preparePageInfo(
		defaultSortMeta: SortMeta,
		lastRow: any,
		requestPageInfo: PageInfo
	): PageInfo {
		if (!requestPageInfo) {
			requestPageInfo = new PageInfo(0, 1, 10, { next: [], previous: [] }, []);
		}
		const currentPage = requestPageInfo.current + 1;
		const targetPage = requestPageInfo.target + 1;
		const pageSize = requestPageInfo.size;
		let pageStateNext = defaultSortMeta.field
			.split(",")
			.map((item) => `'${StringUtils.convertToString(lastRow[item])}'`)
			.join(" , ");

		pageStateNext = Buffer.from(pageStateNext, "utf-8").toString("hex");
		const pginfo = new PageInfo(
			currentPage,
			targetPage,
			pageSize,
			{ next: [pageStateNext], previous: [] },
			[]
		);
		return pginfo;
	}
	static prepareQueryWithBaseQuery(
		query: string,
		columnsMap: Map<string, string>,
		defaultSortMeta: SortMeta,
		filters: Filter[],
		pageInfo: PageInfo,
		groupBy?: string
	): string {
		//SET CRITERIA AND ORDER FOR PAGINATION
		let encodedNextState: string;
		let decodedNextState: string;
		if (pageInfo) {
			encodedNextState = pageInfo?.state?.next[0];
			decodedNextState = encodedNextState
				? Buffer.from(encodedNextState, "hex").toString("utf-8")
				: "";
		}

		let clusterFilters = "";
		let clusterOrders = "";
		const defaultSortCols = defaultSortMeta.field
			.split(",")
			.map(
				(item) =>
					`${
						columnsMap != null && columnsMap.get(item)
							? columnsMap.get(item)
							: StringUtils.camelToSnake(item)
					}`
			)
			.join(" , ");

		if (decodedNextState) {
			const offsetValues = decodedNextState;
			if (defaultSortMeta.order == SortOrder.DESC) {
				clusterFilters = ` AND (${defaultSortCols}) < (${offsetValues})`;
			} else {
				clusterFilters = ` AND (${defaultSortCols}) > (${offsetValues})`;
			}
		}
		clusterOrders = `(${defaultSortCols}) ${defaultSortMeta.order}`;

		//SET PAGE LIMIT]
		let filterExpression = filters
			? FilterCondition.buildFilterExpressionAndPrepend(filters)
			: "";

		if (pageInfo) {
			query =
				query +
				clusterFilters +
				filterExpression +
				groupBy +
				" ORDER BY " +
				clusterOrders +
				" LIMIT " +
				pageInfo.size;
		} else {
			query = query + groupBy + clusterFilters + filterExpression;
		}
		return query;
	}
}
