import { EnumType } from "./enum-type.constant";

export class ReportExportJobTypeConstant extends EnumType<ReportExportJobTypeConstant> {
  public static readonly TRANSACTION_REPORT = new ReportExportJobTypeConstant(
    "TRANSACTION_REPORT",
    "Transaction Report"
  );
  public static readonly MERCHANT_SOA_REPORT = new ReportExportJobTypeConstant(
    "MERCHANT_SOA_REPORT",
    "Merchant Account Statement Report"
  );
  public static readonly MERCHANT_SETTLEMENT_REPORT = new ReportExportJobTypeConstant(
    "MERCHANT_SETTLEMENT_REPORT",
    "Merchant Settlement Report"
  );
  constructor(
    public readonly name: string,
    public readonly displayname: string
  ) {
    super(name);
    this.displayname = displayname;
  }
  public static getValues(): ReportExportJobTypeConstant[] {
    return [this.TRANSACTION_REPORT, this.MERCHANT_SOA_REPORT,this.MERCHANT_SETTLEMENT_REPORT];
  }
  public static getByName(name: string) {
    let results = this.getValues().filter((item) => item.name === name);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }
}
