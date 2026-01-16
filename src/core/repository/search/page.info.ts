import { SortMeta } from './sort.meta';

export interface IState {
  next: string[];
  previous: string[];
}

export class PageInfo {
  current: number;
  target: number;
  size: number;
  state: IState;
  sortInfo: SortMeta[];

  constructor(current: number, target: number, size: number, state: IState, sortInfo: SortMeta[]) {
    this.current = current;
    this.target = target;
    this.size = size;
    this.state = state;
    this.sortInfo = sortInfo;
  }
}

