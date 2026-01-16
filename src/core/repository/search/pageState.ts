export class PageState{
    public next:string;
    public previous:string;
     
    constructor(next:string,previous:string){
        this.next=next;
        this.previous=previous;
    }
    getPageStateNext():string{
        return this.next;
    }

    getPageStatePrevious():string{
        return this.previous;
    }
}