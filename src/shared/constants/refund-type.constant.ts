import { EnumType } from "./enum-type.constant";

export class RefundType extends EnumType<RefundType> {
  public static readonly FULL_REFUND = new RefundType(
    "FULL_REFUND",
    "Full Refund"
  );
  public static readonly PARTIAL_REFUND = new RefundType(
    "PARTIAL_REFUND",
    "Partial Refund"
  );

  constructor(
    public readonly name: string,
    public readonly displayname: string
  ) {
    super(name);
    this.displayname = displayname;
  }

  public static getValues(): RefundType[] {
    return [this.FULL_REFUND, this.PARTIAL_REFUND];
  }
  public static getByName(name: string) {
    let results = this.getValues().filter((item) => item.name === name);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }
  public static getNames() {
    const RefundType = [];
    this.getValues().map((txnStatus) => {
      RefundType.push(txnStatus.name);
    });
    return RefundType;
  }
}
