import { Page } from "./page";
import { PageState } from "./page.state";
import { SortMeta } from "./sort.meta";

export class PageImpl<T> implements Page<T>{
   public totalPages: number;
   public currentPage: number;
   public targetPage:number;
   public size: number;
   public pageState:PageState;
   public totalElements: number;
   public elements: T[];
   public sortMetas: SortMeta[];
   
    constructor(totalPages: number, currentPage: number,targetPage:number, size: number, pageState:PageState,totalElements: number, elements: T[], sortMetas: SortMeta[]) {      
      this.totalPages = totalPages;
      this.currentPage = currentPage;
      this.targetPage=targetPage;
      this.size = size;
      this.pageState=pageState;
      this.totalElements = totalElements;
      this.elements = elements;
      this.sortMetas = sortMetas;
    }
  
  getCurrentPageState(): PageState {
   return this.pageState;
  }
   public getTotalPages(): number {
        return this.totalPages;
      }
    
     public getCurrentPage(): number {
        return this.currentPage;
      }
      public getTargetPage(): number {
        return this.targetPage;
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