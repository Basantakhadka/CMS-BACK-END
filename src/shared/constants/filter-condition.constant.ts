import { DynamicQueryOptions } from "CMS-BACK-END/src/core/repository/query-options";
import { Filter } from "CMS-BACK-END/src/core/repository/search/filter";
import { PageInfo } from "CMS-BACK-END/src/core/repository/search/page.info";
import { SortMeta, SortOrder } from "CMS-BACK-END/src/core/repository/search/sort.meta";
import { IPaginationParameter } from "../utils/pagination-parameter-type";
import { decodePaginationToken } from "../utils/pagination-token-encoder-decoder.utils";
import { EnumType } from "./enum-type.constant";
import { StringUtils } from "../utils/string-utils";
import { DynamicFiltersDto } from "../dtos/filter-conditions.dto";

export class FilterCondition extends EnumType<FilterCondition> {
	public static readonly EXACT = new FilterCondition(
		"EXACT",
		"=",
		null,
		false,
		1
	);
	public static readonly EQUALS = new FilterCondition(
		"EQUALS",
		"=",
		null,
		false,
		1
	);
	public static readonly CONTAINS = new FilterCondition(
		"CONTAINS",
		"contains",
		null,
		false,
		1
	);
	public static readonly CONTAINS_ANY = new FilterCondition(
		"CONTAINS_ANY",
		"contains_any",
		null,
		false,
		1
	);
	public static readonly BETWEEN = new FilterCondition(
		"BETWEEN",
		"between",
		"AND",
		false,
		2
	);
	public static readonly LESS_THAN = new FilterCondition(
		"LESS_THAN",
		"<",
		null,
		false,
		1
	);
	public static readonly GREATER_THAN = new FilterCondition(
		"GREATER_THAN",
		">",
		null,
		false,
		1
	);
	public static readonly LESS_THAN_OR_EQUALS = new FilterCondition(
		"LESS_THAN_OR_EQUALS",
		"<=",
		null,
		false,
		1
	);
	public static readonly GREATER_THAN_OR_EQUALS = new FilterCondition(
		"GREATER_THAN_OR_EQUALS",
		">=",
		null,
		false,
		1
	);
	public static readonly NOT_CONTAINS_ANY = new FilterCondition(
		"NOT_CONTAINS_ANY",
		"not_contains_any",
		null,
		false,
		1
	);
	public static readonly NOT_CONTAINS = new FilterCondition(
		"NOT_CONTAINS",
		"not_contains",
		null,
		false,
		1
	);
	public static readonly NOT_EQUALS = new FilterCondition(
		"NOT_EQUALS",
		"!=",
		null,
		false,
		1
	);
	public static readonly IN = new FilterCondition("IN", "IN", ",", true, 0);
	public static readonly LIKE = new FilterCondition(
		"LIKE",
		"LIKE",
		null,
		true,
		0
	);

	public static readonly ILIKE = new FilterCondition(
		"ILIKE",
		"ILIKE",
		null,
		true,
		0
	);

	constructor(
		public readonly name: string,
		public readonly operator?: string,
		public readonly valueSeperator?: string,
		public readonly enclosedByParenthesis?: boolean,
		public readonly valueLength?: number
	) {
		super(name);
		this.operator = operator;
	}

	public static getValues(): FilterCondition[] {
		return [
			this.EXACT,
			this.EQUALS,
			this.CONTAINS,
			this.CONTAINS_ANY,
			this.BETWEEN,
			this.LESS_THAN,
			this.GREATER_THAN,
			this.LESS_THAN_OR_EQUALS,
			this.GREATER_THAN_OR_EQUALS,
			this.NOT_CONTAINS_ANY,
			this.NOT_CONTAINS,
			this.NOT_EQUALS,
			this.IN,
			this.LIKE,
			this.ILIKE,
		];
	}

	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}

	private buildFilterValuesExpression(
		values: Array<string | number | boolean>
	) {
		let allowedValueLength = this.valueLength;
		let providedValueLength =
			this.name == FilterCondition.BETWEEN.name ? 2 : values.length;
		if (
			(allowedValueLength > 0 && allowedValueLength === providedValueLength) ||
			allowedValueLength == 0
		) {
			if (
				allowedValueLength == 1 ||
				this.name == FilterCondition.BETWEEN.name
			) {
				return this.formatType(values[0]);
			}

			let filterValuesExpression = "";
			for (let i = 0; i < values.length; i++) {
				if (i > 0) {
					filterValuesExpression += this.valueSeperator;
				}
				filterValuesExpression += `${this.formatType(values[i])}`;
			}
			return filterValuesExpression;
		}
		throw new Error("At least one value must be provided");
	}

	static buildFilterExpressionAndPrepend(filters: Filter[]): string {
		var filterExpression = this.buildFilterExpression(filters);
		if (filterExpression?.length > 0) {
			filterExpression = ` AND ${filterExpression}`;
		}
		return filterExpression;
	}

	private formatType(value: any) {
		if (typeof value == "number" || typeof value == "boolean") {
			return value;
		}
		return `'${value}'`;
	}

	static buildFilterExpression(filters: Filter[]): string {
		let filterExpression = "";
		for (let i = 0; i < filters.length; i++) {
			let filter = filters[i];
			if (i > 0) {
				filterExpression += ` AND`;
			}
			filterExpression += FilterCondition.getByName(
				(filter.condition as string) || filter.getConditionString()
			).prepareDynamicCriteria(filter);
		}
		return filterExpression;
	}

	static buildReportFilterExpression(dynamicQueryOptions: DynamicQueryOptions) {
		let paginationQuery = ``;
		const defaultSortInfo = [
			{
				field: "txn_date_time",
				order: SortOrder.DESC,
			},
			{
				field: "txn_id",
				order: SortOrder.ASC,
			},
		];

		paginationQuery += ` ${FilterCondition.buildPaginationFilterExpression(
			dynamicQueryOptions
		)} `;

		paginationQuery += `  ${this.buildOrderByExpression(defaultSortInfo)} `;

		return paginationQuery;
	}

	private prepareDynamicCriteria(filters: Filter) {
		const field = filters.field;
		const dataType = filters.dataType;
		const values = filters.values;
		let filterExpression = ``;

		if (this.name == FilterCondition.BETWEEN.name) {
			filterExpression = ` ${field} `;
			filterExpression += ` ${
				FilterCondition.GREATER_THAN_OR_EQUALS.operator
			} ${this.checkDateAndTimestampType(
				dataType
			)} ${this.buildFilterValuesExpression([values[0]])} ${
				this.valueSeperator
			} ${field} ${
				FilterCondition.LESS_THAN_OR_EQUALS.operator
			} ${this.checkDateAndTimestampType(
				dataType
			)} ${this.buildFilterValuesExpression([values[1]])} `;

			return filterExpression;
		}

		if (this.name == FilterCondition.LIKE.name) {
			filterExpression += ` upper(cast(${field} as varchar)) ${this.operator} upper('%${values}%')`;
			if (dataType === "number") {
				// only append number field in query if search text length is less than or equal to 12
				if (
					values[0]?.toString().length <= 12 &&
					this.checkValueIsValidNumber(values[0])
				) {
					filterExpression += ` OR ${field} = ${values} `;
				}
			}
			return filterExpression;
		}
		if (this.name === FilterCondition.ILIKE.name) {
			filterExpression += `${field} ${this.operator} '%${values}%'`;
			if (dataType === "number") {
				if (
					values[0]?.toString().length <= 12 &&
					this.checkValueIsValidNumber(values[0])
				) {
					filterExpression += ` OR ${field} = ${values}`;
				}
			}
			return filterExpression;
		}
		if (this.name == FilterCondition.EQUALS.name && dataType === "string") {
			filterExpression += ` upper(cast(${field} as varchar)) ${this.operator} upper( trim('${values}') )`;
			return filterExpression;
		}
		filterExpression += ` ${field} ${this.operator} ${
			this.enclosedByParenthesis
				? ` (${this.checkDateAndTimestampType(
						dataType
				  )} ${this.buildFilterValuesExpression(values)}) `
				: ` ${this.checkDateAndTimestampType(
						dataType
				  )} ${this.buildFilterValuesExpression(values)} `
		} `;

		return filterExpression;
	}

	static buildFilterExpressionWithDynamicFilter(
		dynamicFilters: DynamicFiltersDto
	): string {
		let filters: Filter[] = dynamicFilters.filters;
		let isSearchFilter = false;

		let filterExpression = !filters.length ? "" : " WHERE ";

		const addedFilters = [];

		for (let i = 0; i < filters.length; i++) {
			let filter = filters[i];
			if (!(filter instanceof Filter)) {
				addedFilters.push(filter);
			}
			if (i > 0) {
				if (filter.condition === "LIKE" && !isSearchFilter) {
					filterExpression += addedFilters?.length
						? `  AND ( `
						: !(filter instanceof Filter)
						? ` AND ( `
						: `OR ( `;
					isSearchFilter = true;
				} else {
					filterExpression +=
						filter.condition === FilterCondition.LIKE.name ? ` OR ` : ` AND `;
				}
			}

			filterExpression += FilterCondition.getByName(
				filter.condition as string
			).prepareDynamicCriteria(filter);
		}
		filterExpression += ` ${isSearchFilter ? " ) " : ""}`;

		return filterExpression;
	}

	static buildFilterExpressionWithOrderAndGroup(
		dynamicQueryOptions: DynamicQueryOptions
	): string {
		let filters: Filter[] = dynamicQueryOptions.dynamicFilters.filters;
		let groupByFilters: string[] = dynamicQueryOptions.groupByColumnNames;
		let sortInfoFilters: SortMeta[] =
			dynamicQueryOptions.dynamicFilters.pageInfo?.sortInfo || [];
		let pageInfo: PageInfo = dynamicQueryOptions.dynamicFilters.pageInfo;
		let isSearchFilter = false;

		let filterExpression = !filters.length ? "" : " AND";

		const addedFilters = [];

		for (let i = 0; i < filters.length; i++) {
			let filter = filters[i];
			if (!(filter instanceof Filter)) {
				addedFilters.push(filter);
			}
			if (i > 0) {
				if (filter.condition === "LIKE" && !isSearchFilter) {
					filterExpression += addedFilters?.length
						? `  AND ( `
						: !(filter instanceof Filter)
						? ` AND ( `
						: `OR ( `;
					isSearchFilter = true;
				} else {
					filterExpression +=
						filter.condition === FilterCondition.LIKE.name ? ` OR ` : ` AND `;
				}
			}

			filterExpression += FilterCondition.getByName(
				filter.condition as string
			).prepareDynamicCriteria(filter);
		}
		filterExpression += ` ${
			isSearchFilter ? " ) " : ""
		} ${this.buildGroupByExpression(
			groupByFilters
		)} ${this.buildOrderByExpression(sortInfoFilters)} `;

		return filterExpression;
	}

	private static buildGroupByExpression(groupByFilters: string[]): string {
		if (!groupByFilters?.length) {
			return "";
		}

		let groupByExpression = ` GROUP BY `;

		for (let i = 0; i < groupByFilters.length; i++) {
			if (i > 0) {
				groupByExpression += ` , `;
			}
			groupByExpression += ` ${groupByFilters[i]} `;
		}

		return groupByExpression;
	}

	static buildOrderByExpression(orderByFilters: SortMeta[]) {
		if (!orderByFilters.length) {
			return "";
		}

		let orderByExpression = ` ORDER BY `;

		for (let i = 0; i < orderByFilters.length; i++) {
			const orderBy = orderByFilters[i];
			if (i > 0) {
				orderByExpression += `, `;
			}
			orderByExpression += ` ${orderBy.field} ${orderBy.order} `;
		}

		return orderByExpression;
	}

	private checkDateAndTimestampType(dataType: string) {
		return dataType && dataType === "date"
			? " DATE "
			: dataType && dataType === "timestamp"
			? " TIMESTAMP "
			: "";
	}

	static buildPaginationExpression(paginationParameter: IPaginationParameter) {
		let paginationQuery = ``;
		let doPagination = false;
		let isNextNavigation = true;
		const defaultSortInfo: SortMeta[] = [
			{
				field: paginationParameter.timestampField,
				order: SortOrder.DESC,
			},
			{
				field: paginationParameter.idField,
				order: SortOrder.ASC,
			},
		];

		const pageInfo =
			paginationParameter.dynamicQueryOptions.dynamicFilters.pageInfo;

		if (pageInfo) {
			let dynamicQueryOptions = paginationParameter.dynamicQueryOptions;

			if (
				pageInfo.current < pageInfo.target &&
				pageInfo.current !== 0 &&
				pageInfo.target !== 1
			) {
				dynamicQueryOptions.dynamicFilters.pageInfo.sortInfo = [
					{
						field: paginationParameter.timestampField,
						order: SortOrder.DESC,
					},
					{
						field: paginationParameter.idField,
						order: SortOrder.ASC,
					},
				];
				const decodedNextToken =
					decodePaginationToken(pageInfo.state?.next[0]) || null;

				paginationQuery = ` WHERE ( ${paginationParameter.timestampField} < TIMESTAMP '${decodedNextToken.timestamp}' OR ( ${paginationParameter.timestampField} = TIMESTAMP '${decodedNextToken.timestamp}' AND ${paginationParameter.idField} > '${decodedNextToken.uid}' )) `;
				doPagination = true;
			}

			if (pageInfo.current > pageInfo.target) {
				dynamicQueryOptions.dynamicFilters.pageInfo.sortInfo = [
					{
						field: paginationParameter.timestampField,
						order: SortOrder.ASC,
					},
					{
						field: paginationParameter.idField,
						order: SortOrder.DESC,
					},
				];
				const decodedPreviousToken =
					decodePaginationToken(pageInfo.state?.previous[0]) || null;
				paginationQuery = ` WHERE ( ${paginationParameter.timestampField} > TIMESTAMP '${decodedPreviousToken.timestamp}' OR ( ${paginationParameter.timestampField} = TIMESTAMP '${decodedPreviousToken.timestamp}' AND ${paginationParameter.idField} < '${decodedPreviousToken.uid}' )) `;

				doPagination = true;
				isNextNavigation = false;
			}

			if (pageInfo.current === pageInfo.target) {
				return paginationQuery;
			}

			paginationQuery += ` ${
				doPagination &&
				paginationParameter.dynamicQueryOptions.dynamicFilters.filters.length
					? "AND"
					: ""
			} ${FilterCondition.buildPaginationFilterExpression(
				paginationParameter.dynamicQueryOptions
			)} ${
				!isNextNavigation
					? ` ) ${this.buildOrderByExpression(defaultSortInfo)} `
					: ""
			} `;
		}

		return paginationQuery;
	}

	private static buildLimitByExpression(size: number): string {
		if (!size) {
			return "";
		}

		return ` LIMIT ${size} `;
	}

	static buildPaginationFilterExpression(
		dynamicQueryOptions: DynamicQueryOptions
	): string {
		let filters: Filter[] = dynamicQueryOptions.dynamicFilters.filters;
		let groupByFilters: string[] = dynamicQueryOptions.groupByColumnNames;
		let sortInfoFilters: SortMeta[] =
			dynamicQueryOptions.dynamicFilters.pageInfo?.sortInfo || [];
		let pageInfo: PageInfo = dynamicQueryOptions.dynamicFilters.pageInfo;
		let isSearchFilter = false;

		let filterExpression = ``;
		if (!(pageInfo?.state?.next.length || pageInfo?.state?.previous.length)) {
			filterExpression = !filters.length ? "" : " WHERE ";
		}
		const addedFilters = [];

		for (let i = 0; i < filters.length; i++) {
			let filter = filters[i];
			if (!(filter instanceof Filter)) {
				addedFilters.push(filter);
			}

			if (i > 0) {
				if (filter.condition === "LIKE" && !isSearchFilter) {
					filterExpression += addedFilters?.length
						? `  AND ( `
						: !(filter instanceof Filter)
						? ` AND ( `
						: `OR ( `;
					isSearchFilter = true;
				} else {
					filterExpression +=
						filter.condition === FilterCondition.LIKE.name ? ` OR ` : ` AND `;
				}
			}

			filterExpression += FilterCondition.getByName(
				filter.condition as string
			).prepareDynamicCriteria(filter);
		}
		filterExpression += ` ${
			isSearchFilter ? " ) " : ""
		} ${this.buildGroupByExpression(
			groupByFilters
		)} ${this.buildOrderByExpression(
			sortInfoFilters
		)} ${this.buildLimitByExpression(pageInfo.size)} `;

		return filterExpression;
	}

	private checkValueIsValidNumber(string) {
		// Use the regular expression to check for a valid number pattern
		return /^-?\d+(\.\d+)?$/.test(string);
	}
}
