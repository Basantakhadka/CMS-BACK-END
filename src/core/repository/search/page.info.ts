import { SortMeta } from './sort.meta';

export class PageInfo {
  current: number;
  size: number;
  sortInfo: SortMeta[];

  constructor (current: number, size: number, sortInfo: SortMeta[]) {
    this.current = current;
    this.size = size;
    this.sortInfo = sortInfo;
  }
}

