import { PageInfo } from './page.info';
import { SortMeta } from './sort.meta';

export class PageableInfo {
  pageInfo: PageInfo;
  sortMetas: SortMeta[];
  current: any;
  size: any;
  sortInfo: any;

  constructor (pageInfo: PageInfo, sortMetas: SortMeta[]) {
    this.pageInfo = pageInfo;
    this.sortMetas = sortMetas;
  }
}
