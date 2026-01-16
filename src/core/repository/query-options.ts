import { DynamicFiltersDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { Filter } from "./search/filter";

export class QueryOptions {
    columnNamesSelection: string[];
    groupByColumnNames: string[];
    filters: Filter[];
  
    constructor(columnNamesSelection: string[], groupByColumnNames: string[], filters: Filter[]) {
      this.columnNamesSelection = columnNamesSelection;
      this.groupByColumnNames = groupByColumnNames;
      this.filters = filters;
    }
}
  
export class DynamicQueryOptions {
  columnNamesSelection?: string[];
  groupByColumnNames?: string[];
  dynamicFilters: DynamicFiltersDto;

  constructor (columnNamesSelection: string[], groupByColumnNames: string[], dynamicFilters: DynamicFiltersDto) {
    this.columnNamesSelection = columnNamesSelection;
    this.groupByColumnNames = groupByColumnNames;
    this.dynamicFilters = dynamicFilters;
  }
}
  