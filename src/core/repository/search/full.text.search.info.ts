export class FullTextSearchInfo{
   public searchFields:[string];
   public searchValue:string;
   
   public addSearchField(searchField:string){
    this.searchFields.push[searchField]
}
public setSearchValue(searchValue:string){
    this.searchValue=searchValue;
}
public getSearchValue():string{
    return this.searchValue;
}
public setSearchFields(searchFields:[string]){
    this.searchFields=searchFields;
}
public getSearchFields():[string]{
    return this.searchFields;
}

}