import { SortMeta } from './sort.meta';
export interface Page<T> {
  getTotalPages(): number;

  getCurrentPage(): number;

  getSize(): number;


  getTotalElements(): number;

  getElements(): T[];

  getSortMetas(): SortMeta[];
}
