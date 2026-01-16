export class EnumType {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static getValues(): MsfChangeRequestStatus[] {
    throw new Error("EnumType getValues() not implemented.");
  }

  static getByName(name: string) {
    throw new Error("EnumType getByName() not implemented.");
  }
}
export class MsfChangeRequestStatus extends EnumType {
  public static readonly IN_REVIEW = new MsfChangeRequestStatus('IN_REVIEW', 'In-Review');
  public static readonly APPROVED = new MsfChangeRequestStatus('APPROVED', 'Approved');
  public static readonly APPROVAL_PENDING = new MsfChangeRequestStatus('APPROVAL_PENDING', 'Approval Pending');
  public static readonly REQUEST_FOR_CHANGE = new MsfChangeRequestStatus('REQUEST_FOR_CHANGE', 'Request for Change');

  private constructor(public readonly name: string, public readonly displayName: string) {
    super(name);
    this.displayName = displayName;
  }
  public static getValues(): MsfChangeRequestStatus[] {
    return [
      this.IN_REVIEW,
      this.APPROVED,
      this.APPROVAL_PENDING,
      this.REQUEST_FOR_CHANGE
    ];
  }

  public static getByName(name: string) {
    let results = this.getValues().filter(item => item.name === name);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }
}