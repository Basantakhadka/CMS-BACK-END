export class EnumType{
    name : string;

    constructor(name: string){
      this.name = name;
    }

    static getValues(): ApplicationEnrolledStatus[]{
      throw new Error("EnumType getValues() not implemented.");
    }

    static getByName(name : string){
      throw new Error("EnumType getByName() not implemented.");
    }
}

export class ApplicationEnrolledStatus extends EnumType{

  public static readonly ACTIVE = new ApplicationEnrolledStatus('ACTIVE', 'Active');
  public static readonly INACTIVE = new ApplicationEnrolledStatus('INACTIVE', 'Not Active');
  private constructor(public readonly name: string, public readonly displayName: string) {
    super(name);
    this.displayName = displayName;
  }

  public static getValues(): ApplicationEnrolledStatus[]{
    return [
      this.ACTIVE,
      this.INACTIVE
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
