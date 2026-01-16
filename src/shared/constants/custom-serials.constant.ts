import { EnumType } from "./enum-type.constant";

export class CustomSerialsType extends EnumType<CustomSerialsType>{
  public static readonly MID = new CustomSerialsType('MID', 'MID');
  public static readonly TID = new CustomSerialsType('TID', 'TID');

  private constructor(public readonly name: string, public readonly displayName: string) {
    super(name);
    this.displayName = displayName;
  }

  public static getValues(): CustomSerialsType[]{
    return [
      this.MID,
      this.TID
    ];
  }

  public static getByName(name : string){
    let results = this.getValues().filter(item => item.name === name);
    if(results && results.length > 0){
      return results[0];
    }
    return null;
  }
}