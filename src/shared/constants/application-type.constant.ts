export class EnumType{
    name : string;

    constructor(name: string){
      this.name = name;
    }

    static getValues(): ApplicationType[]{
      throw new Error("EnumType getValues() not implemented.");
    }

    static getByName(name : string){
      throw new Error("EnumType getByName() not implemented.");
    }
}

export class ApplicationType extends EnumType{
  public static readonly SELF = new ApplicationType('SELF_APPLIED', 'Self Applied');
  public static readonly BACK_OFFICE = new ApplicationType('BACK_OFFICE', 'Back Office');

  public static readonly ACCOUNT_API= new ApplicationType('ACCOUNT_API', 'Account API');

  private constructor(public readonly name: string, public readonly displayName: string) {
    super(name);
    this.displayName = displayName;
  }

  public static getValues(): ApplicationType[]{
    return [
      this.SELF,
      this.BACK_OFFICE,
      this.ACCOUNT_API
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