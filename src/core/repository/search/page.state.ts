export class PageState{
    next:string[];
    previous:string[];
    constructor(
         next: string[],
         previous: string[]
    ){
        this.next=next;
        this.previous=previous;
    }
}