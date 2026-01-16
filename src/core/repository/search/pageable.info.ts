import { PageInfo } from './page.info';
import { Rowlimit } from './rowlimit';
import { SortMeta } from './sort.meta';

export class PageableInfo {
  pageInfo: PageInfo;
  sortMetas: SortMeta[];
    state: any;
    current: any;
    target: any;
    size: any;
    sortInfo: any;

  constructor(pageInfo: PageInfo, sortMetas: SortMeta[]) {
    this.pageInfo = pageInfo;
    this.sortMetas = sortMetas;
  }
}
