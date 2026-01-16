export class EnumType{
    name : string;

    constructor(name: string){
      this.name = name;
    }

    static getValues(): MerchantDashboardStatus[]{
      throw new Error("EnumType getValues() not implemented.");
    }

    static getByName(name : string){
      throw new Error("EnumType getByName() not implemented.");
    }
}

export class MerchantDashboardStatus extends EnumType{
  public static readonly NEW_SIGNUP = new MerchantDashboardStatus('NEW_SIGNUP', 'New Signup');
  public static readonly ENROLLED = new MerchantDashboardStatus('ENROLLED', 'Enrolled');
  public static readonly ACTIVE = new MerchantDashboardStatus('ACTIVE', 'Active');
  public static readonly IN_ACTIVE = new MerchantDashboardStatus('IN_ACTIVE', 'Inactive');

  private constructor(public readonly name: string, public readonly displayName: string) {
    super(name);
    this.displayName = displayName;
  }

  public static getValues(): MerchantDashboardStatus[]{
    return [
      this.NEW_SIGNUP,
      this.ENROLLED,
      this.ACTIVE,
      this.IN_ACTIVE
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
