import { Page } from "./page";
import { SortMeta } from "./sort.meta";

export class PageImpl<T> implements Page<T> {
  public totalPages: number;
  public currentPage: number;
  public size: number;
  public totalElements: number;
  public elements: T[];
  public sortMetas: SortMeta[];

  constructor (totalPages: number, currentPage: number, size: number, totalElements: number, elements: T[], sortMetas: SortMeta[]) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.size = size;
    this.totalElements = totalElements;
    this.elements = elements;
    this.sortMetas = sortMetas;
  }

  public getTotalPages(): number {
    return this.totalPages;
  }

  public getCurrentPage(): number {
    return this.currentPage;
  }
  public getSize(): number {
    return this.size;
  }

  public getTotalElements(): number {
    return this.totalElements;
  }

  public getElements(): T[] {
    return this.elements;
  }

  public getSortMetas(): SortMeta[] {
    return this.sortMetas;
  }
}