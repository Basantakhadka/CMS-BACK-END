export class PermissionPointEnumType<T>{
    endpoint : string;
  
    constructor(endpoint: string){
      this.endpoint = endpoint;
    }
  
    getValues(): Array<T>{
      throw new Error("EnumType getValues() not implemented.");
    }
  
    static getByName(name : string){
      throw new Error("EnumType getByName() not implemented.");
    }
}