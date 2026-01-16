import { EnumType } from "./enum-type.constant";

export class ExportReportJobConstant extends EnumType<ExportReportJobConstant> {
  public static readonly TRANSACTION_REPORT = new ExportReportJobConstant(
    "TRANSACTION_REPORT",
    "Transaction Report"
  );
  public static readonly MERCHANT_REPORT = new ExportReportJobConstant(
    "MERCHANT_REPORT",
    "Merchant Report"
  );
  public static readonly MERCHANT_SETTLEMENT_REPORT =
    new ExportReportJobConstant(
      "MERCHANT_SETTLEMENT_REPORT",
      "Merchant SEttlement Report"
    );
  public static readonly CUSTOMER_LIST = new ExportReportJobConstant(
    "CUSTOMER_LIST",
    "Customer List"
  );
  public static readonly RISK_AFFECTED_MERCHANTS = new ExportReportJobConstant(
    "RISK_AFFECTED_MERCHANTS",
    "Risk Affected Merchants"
  );

  constructor(
    public readonly name: string,
    public readonly displayname: string
  ) {
    super(name);
    this.displayname = displayname;
  }
}
