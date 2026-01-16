export class EnumType<T>{
  name : string;

  constructor(name: string){
    this.name = name;
  }

  getValues(): Array<T>{
    throw new Error("EnumType getValues() not implemented.");
  }

  static getByName(name : string){
    throw new Error("EnumType getByName() not implemented.");
  }
}