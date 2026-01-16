import { SortMeta } from './sort.meta';
import { PageState } from './page.state';
export interface Page<T> {
  getTotalPages(): number;

  getCurrentPage(): number;
  
  getTargetPage(): number;
  
  getSize(): number;
  
  getCurrentPageState(): PageState;

  getTotalElements(): number;

  getElements(): T[];

  getSortMetas(): SortMeta[];
}
