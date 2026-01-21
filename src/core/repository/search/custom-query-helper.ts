import { StringUtils } from "@app/shared/utils/string-utils";
import { Filter } from "./filter";
import { PageInfo } from "./page.info";
import { DynamicQueryBuilder } from "./query-builder";
import { SortMeta, SortOrder } from "./sort.meta";
import { FilterCondition } from "@app/shared/constants/filter-condition.constant";

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
		let clusterFilters = "";
		const defaultSortCols = defaultSortMeta.field
			.split(",")
			.map(
				(item) =>
					`${ columnsMap != null && columnsMap.get(item)
						? columnsMap.get(item)
						: StringUtils.camelToSnake(item)
					}`
			)
			.join(" , ");


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
		let clusterFilters = "";
		let clusterOrders = "";
		const defaultSortCols = defaultSortMeta.field
			.split(",")
			.map(
				(item) =>
					`${ columnsMap != null && columnsMap.get(item)
						? columnsMap.get(item)
						: StringUtils.camelToSnake(item)
					}`
			)
			.join(" , ");

		clusterOrders = `(${ defaultSortCols }) ${ defaultSortMeta.order }`;

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
		const currentPage = requestPageInfo.current + 1;
		const pageSize = requestPageInfo.size;
		const pginfo = new PageInfo(
			currentPage,
			pageSize,
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

		let clusterFilters = "";
		let clusterOrders = "";
		const defaultSortCols = defaultSortMeta.field
			.split(",")
			.map(
				(item) =>
					`${ columnsMap != null && columnsMap.get(item)
						? columnsMap.get(item)
						: StringUtils.camelToSnake(item)
					}`
			)
			.join(" , ");

		clusterOrders = `(${ defaultSortCols }) ${ defaultSortMeta.order }`;

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
