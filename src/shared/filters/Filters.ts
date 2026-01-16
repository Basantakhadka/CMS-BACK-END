import { Filter } from "CMS-BACK-END/src/core/repository/search/filter";
import { FilterCondition } from "../constants/filter-condition.constant";
import { DynamicQueryOptions } from "CMS-BACK-END/src/core/repository/query-options";
import { DynamicFiltersDto } from "../dtos/filter-conditions.dto";
import { SortOrder } from "CMS-BACK-END/src/core/repository/search/sort.meta";
import { DateUtils } from "../date-utils";

export class Filters<
  T extends {
    getColumns(): Map<string, string>;
    getColumnType(key: string): string;
    getColumnName(name: string): string;
  }
> {
  constructor(
    private request: DynamicFiltersDto,
    private entity: T,
    private sortFields?: { DESC: string; ASC: string }
  ) {}

  public prepareFilters(period?: string) {
    let preparedFilters: Filter[] = [];

    if (period) {
      const dateToday = DateUtils.getTodayDate();
      const todayDate = `${dateToday.year}-${dateToday.month}-${dateToday.date}`;
      const currentMonth = +`${dateToday.year}${dateToday.month}`;
	  
      switch (period) {
        case "today":
          preparedFilters.push({
            field: this.entity.getColumnName("txnDate"),
            condition: FilterCondition.EQUALS.name,
            values: [todayDate],
            dataType: this.entity.getColumnType("txnDate"),
          } as any);
          break;
        case "month":
          if (
            !this.request.filters.some((filter) => filter.field === "txnDate")
          ) {
            preparedFilters.push({
              field: this.entity.getColumnName("txnYearMonth"),
              condition: FilterCondition.EQUALS.name,
              values: [currentMonth],
              dataType: this.entity.getColumnType("txnYearMonth"),
            } as any);
          }
          break;
        case "all":
        default:
          break;
      }
    }

    const filters = this.request.filters.map((filter) => {
      filter.dataType = this.entity.getColumnType(filter.field);
      filter.field = this.entity.getColumnName(filter.field);
      if (filter.dataType === "number") {
        filter.values = filter.values.map((value) => {
          return +value;
        });
      }
      if (filter.dataType === "timestamp") {
        const timeStamp = ["00:00:00", "23:59:59"];
        filter.values = filter.values.map((value, i) => {
          return `${value} ${timeStamp[i]}`;
        });
      }
      return filter;
    });

    // Prepare search text filter if present
    if (this.request.searchText && this.request.searchText !== "") {
      this.entity.getColumns().forEach((data, key) => {
        filters.push(
          new Filter(
            data,
            FilterCondition.LIKE.name,
            [this.request.searchText],
            this.entity.getColumnType(key)
          )
        );
      });
    }

    preparedFilters.push(...filters);
    return preparedFilters;
  }

  public prepareDynamicQueryOptions() {
    let dynamicQueryOptions: DynamicQueryOptions;

    let dynamicFilterConditions: DynamicFiltersDto = new DynamicFiltersDto();
    dynamicFilterConditions.pageInfo = this.request.pageInfo;
    dynamicFilterConditions.searchText = this.request.searchText;

    // Default sortInfo
    if (
      !dynamicFilterConditions.pageInfo?.sortInfo?.length &&
      this.sortFields &&
      Object.keys(this.sortFields)?.length
    ) {
      dynamicFilterConditions.pageInfo.sortInfo?.push(
        {
          field: this.sortFields.DESC,
          order: SortOrder.DESC,
        },
        {
          field: this.sortFields.ASC,
          order: SortOrder.ASC,
        }
      );
    }
    const columns = [];
    // Prepare selection column for query
    this.entity.getColumns().forEach((data) => columns.push(data));

    // Map request sort field to column name
    if(dynamicFilterConditions.pageInfo){
			dynamicFilterConditions.pageInfo.sortInfo = dynamicFilterConditions.pageInfo.sortInfo?.map((sortInfo) => {
					sortInfo.field = this.entity.getColumnName(sortInfo.field);
					return sortInfo;
				});
		}

    dynamicFilterConditions.filters = this.prepareFilters();

    dynamicQueryOptions = new DynamicQueryOptions(
      columns,
      [],
      dynamicFilterConditions
    );

    return dynamicQueryOptions;
  }
}
