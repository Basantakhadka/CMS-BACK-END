import { Filter, FilterCondition } from "CMS-BACK-END/src/core/repository/search/filter";
import { DateUtils } from "../date-utils";

export class PreparePeriodWiseDashboardFilter {
    static prepareFiltersForDayWise(year:string, month:string, day:string):[Filter[],Filter[]]{
        const currentFullDate = DateUtils.getTodayDate();
        const currentYear = [parseInt(currentFullDate.year)];
        const currentMonth  = [parseInt(currentFullDate.year + currentFullDate.month)];
        const currentDate = [`${currentFullDate.year}-${currentFullDate.month}-${currentFullDate.date}`];
  
        const previousFullDate = DateUtils.getYesterdayDate();
        const previousYear = [parseInt(previousFullDate.year)];
        const previousMonth  = [parseInt(previousFullDate.year + previousFullDate.month)];
        const previousDate = [`${previousFullDate.year}-${previousFullDate.month}-${previousFullDate.date}`];
  
        let filterForPrevious:Filter[] = [];
        filterForPrevious.push(new Filter(year, FilterCondition.equals, previousYear));
        filterForPrevious.push(new Filter(month, FilterCondition.equals, previousMonth));
        filterForPrevious.push(new Filter(day, FilterCondition.equals, previousDate));
  
        let filterForCurrent:Filter[] = [];
        filterForCurrent.push(new Filter(year, FilterCondition.equals, currentYear));
        filterForCurrent.push(new Filter(month, FilterCondition.equals, currentMonth));
        filterForCurrent.push(new Filter(day, FilterCondition.equals, currentDate));
  
        let filters:[Filter[],Filter[]] = [filterForCurrent, filterForPrevious];
        return filters;
      }

    static prepareFiltersForMonthWise(year:string, month:string,):[Filter[],Filter[]]{
        const currentFullDate = DateUtils.getTodayDate();
        const currentYear = [parseInt(currentFullDate.year)];
        const currentMonth  = [parseInt(currentFullDate.year + currentFullDate.month)];
  
        const previousFullDate = DateUtils.getPreviousMonth();
        const previousYear = [parseInt(previousFullDate.year)];
        const previousMonth  = [parseInt(previousFullDate.year + previousFullDate.month)];  
  
        let filterForPrevious:Filter[] = [];
        filterForPrevious.push(new Filter(year, FilterCondition.equals, previousYear));
        filterForPrevious.push(new Filter(month, FilterCondition.equals, previousMonth));
  
        let filterForCurrent:Filter[] = [];
        filterForCurrent.push(new Filter(year, FilterCondition.equals, currentYear));
        filterForCurrent.push(new Filter(month, FilterCondition.equals, currentMonth));
  
        let filters:[Filter[],Filter[]] = [filterForCurrent, filterForPrevious];
        return filters;
      }

      static prepareFiltersForWeekWise(date:string):[Filter[],Filter[]]{
        const currentFullDate = DateUtils.getCurrentWeek();
        const startOfCurrentWeek = [`${currentFullDate.startOfCurrentWeek.year}-${currentFullDate.startOfCurrentWeek.month}-${currentFullDate.startOfCurrentWeek.date}`];
        const endOfCurrentWeek = [`${currentFullDate.endOfCurrentWeek.year}-${currentFullDate.endOfCurrentWeek.month}-${currentFullDate.endOfCurrentWeek.date}`];
  
        const previousFullDate = DateUtils.getPreviousWeek();
        const startOfPreviousWeek = [`${previousFullDate.startOfPreviousWeek.year}-${previousFullDate.startOfPreviousWeek.month}-${previousFullDate.startOfPreviousWeek.date}`];
        const endOfPreviousWeek = [`${previousFullDate.endOfPreviousWeek.year}-${previousFullDate.endOfPreviousWeek.month}-${previousFullDate.endOfPreviousWeek.date}`];
  
        let filterForPrevious:Filter[] = [];
        filterForPrevious.push(new Filter(date, FilterCondition.greater_than_or_equals, startOfPreviousWeek));
        filterForPrevious.push(new Filter(date, FilterCondition.less_than_or_equals, endOfPreviousWeek));
  
        let filterForCurrent:Filter[] = [];
        filterForCurrent.push(new Filter(date, FilterCondition.greater_than_or_equals, startOfCurrentWeek));
        filterForCurrent.push(new Filter(date, FilterCondition.less_than_or_equals, endOfCurrentWeek));
  
        let filters:[Filter[],Filter[]] = [filterForCurrent, filterForPrevious];
        return filters;
      }
}