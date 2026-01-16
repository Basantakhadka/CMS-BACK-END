import { EnumType } from "../enum-type.constant";

export class MsfStatus extends EnumType<MsfStatus>{
  public static readonly ACTIVE = new MsfStatus('ACTIVE', 'Active');
  public static readonly INACTIVE = new MsfStatus('INACTIVE', 'Inactive');

  constructor(public readonly name:string, public readonly displayname:string){
    super(name);
    this.displayname = displayname;
  }

  public static getValues(): MsfStatus[]{
    return [
      this.ACTIVE,
      this.INACTIVE,
    ];
  }

  public static getByName(name : string):MsfStatus{
    let results = this.getValues().filter(item => item.name === name.toUpperCase());
    if(results && results.length > 0){
      return results[0];
    }
    return null;
  }


}
