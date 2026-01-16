export class ValueWithLabelEnumType<T>{
    value : string;
  
    constructor(value: string){
      this.value = value;
    }
  
    getValues(): Array<T>{
      throw new Error("EnumType getValues() not implemented.");
    }
  
    static getByName(name : string){
      throw new Error("EnumType getByName() not implemented.");
    }
  }