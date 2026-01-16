export class EnumType{
    name : string;

    constructor(name: string){
      this.name = name;
    }

    static getValues(): ApplicationStatus[]{
      throw new Error("EnumType getValues() not implemented.");
    }

    static getByName(name : string){
      throw new Error("EnumType getByName() not implemented.");
    }
}

export class ApplicationStatus extends EnumType{
  public static readonly DRAFT = new ApplicationStatus('DRAFT', 'Draft');
  public static readonly IN_REVIEW = new ApplicationStatus('IN_REVIEW', 'In-Review');
  public static readonly APPROVED = new ApplicationStatus('APPROVED', 'Approved');
  public static readonly IN_APPROVAL = new ApplicationStatus('IN_APPROVAL', 'In-Approval');
  public static readonly REQUEST_FOR_CHANGE = new ApplicationStatus('REQUEST_FOR_CHANGE', 'Request for Change');
  public static readonly REJECTED = new ApplicationStatus('REJECTED', 'Rejected');
  public static readonly IN_FEE_SETUP = new ApplicationStatus('IN_FEE_SETUP', 'In Fee Configuration')

  private constructor(public readonly name: string, public readonly displayName: string) {
    super(name);
    this.displayName = displayName;
  }

  public static getValues(): ApplicationStatus[]{
    return [
      this.DRAFT,
      this.IN_REVIEW,
      this.APPROVED,
      this.REQUEST_FOR_CHANGE,
      this.IN_APPROVAL,
      this.REJECTED,
      this.IN_FEE_SETUP
    ];
  }

  public static getByName(name : string){
    let results = this.getValues().filter(item => item.name === name);
    if(results && results.length > 0){
      return results[0];
    }
    return null;
  }

  public static getStatusNamesExceptRejected() {
    let results: string[] = [];
    this.getValues().forEach(status => {
      if (status !== this.REJECTED)
        results.push(status.name);
    })
    return results;
  }

}
