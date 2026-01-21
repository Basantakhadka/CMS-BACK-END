import { Filter } from "./filter";
import { FullTextSearchInfo } from "./full.text.search.info";

export class SearchMeta {
  public filters: Filter[];
  public fullTextSearchInfo?: FullTextSearchInfo;


  addFilter(filter: Filter) {
    this.filters = [filter];
  }
  setFullTextSearchInfo(fullTextSearchInfo: FullTextSearchInfo) {
    this.fullTextSearchInfo = fullTextSearchInfo;
  }
  getFilters(): Filter[] {
    return this.filters;
  }
  getFullTextSearchInfo(): FullTextSearchInfo {
    return this.fullTextSearchInfo;
  }
}
