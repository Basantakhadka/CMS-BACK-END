import { FilterConditionsDto, FilterOnlyDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";

export class FilterExpressionUtils {
  static buildFilterExpression(filterConditions: FilterConditionsDto | FilterOnlyDto): string {
    let filterExpression = "";
    for (let i = 0; i < filterConditions.filters.length; i++) {
      let filter = filterConditions.filters[i];
      if (i > 0) {
        filterExpression += ` AND `;
      }
      switch (filter.condition) {
        case "exact":
          filterExpression += `${
            filter.field
          } = ${this.buildFilterValuesExpression(
            filter.values
          )}`;
          break;
        case "between":
          if (filter.values.length===0){
              throw new Error("Between condition should contain two values")
          }
          filterExpression += `${
            filter.field
          } >= ${
            filter.values[0]
          } AND ${filter.field} <= ${
            filter.values[1]
          }`;

          break;
        default:
          filterExpression += `${filter.field} ${
            filter.condition
          } ${this.buildFilterValuesExpression(
            filter.values
          )}`;
          break;
      }
    }
    return filterExpression;
  }

  private static buildFilterValuesExpression(values: any[]) {
    if (values.length === 1) {
      return this.formatType(values[0]);
    } else {
      let filterValuesExpression = "(";
      for (let i = 0; i < values.length; i++) {
        if (i > 0) {
          filterValuesExpression += ", ";
        }
        filterValuesExpression += `${
          this.formatType(values[i])
        }`;
      }
      filterValuesExpression += ")";
      return filterValuesExpression;
    }
  }
  private static formatType(value:any){
    if (typeof value ==  'number'){
      return value;
    }
      return `'${value}'`
  }

}
