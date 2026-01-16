import { EnumType } from "../enum-type.constant";

export class KafkaReportExportJobTypeEventConstant extends EnumType<KafkaReportExportJobTypeEventConstant> {
  public static readonly REQUEST_EXPORT_EXCEL_REPORT =
    new KafkaReportExportJobTypeEventConstant(
      "REQUEST_EXPORT_EXCEL_REPORT",
      "request-export-excel-report-member",
      "request-export-excel-report-member-group",
      "excel-report"
    );
  public static readonly REQUEST_TRANSACTION_EXPORT =
    new KafkaReportExportJobTypeEventConstant(
      "REQUEST_TRANSACTION_EXPORT",
      "request-transaction-export-member",
      "request-transactiom-export-member-group",
      "excel-transaction-report")
  public static readonly REQUEST_SOA_EXCEL_REPORT =
    new KafkaReportExportJobTypeEventConstant(
      "REQUEST_SOA_EXCEL_REPORT",
      "request-soa-excel-report-member",
      "request-soa-excel-report-member-group",
      "soa-excel-report"
    );
  public static readonly REQUEST_DISCOUNT_REPORT_EXPORT_JOB_REPORT =
    new KafkaReportExportJobTypeEventConstant(
      "REQUEST_DISCOUNT_REPORT_EXPORT_JOB_REPORT",
      "request-discount-report-export-job-report-member",
      "request-discount-report-export-job-report-member-group",
      "export-job-request"
    )
    public static readonly REQUEST_MERCHANT_SETTLEMENT_REPORT_EXPORT_JOB_REPORT =
    new KafkaReportExportJobTypeEventConstant(
      "REQUEST_MERCHANT_SETTLEMENT_REPORT_EXPORT_JOB_REPORT",
      "request-merchant-settlement-report-export-job-report-member",
      "request-merchant-settlement-report-export-job-report-member-group",
      "export-job-request"
    )

  public static readonly REQUEST_MERCHANT_LIST_REPORT_EXPORT_JOB_REPORT =
      new KafkaReportExportJobTypeEventConstant(
          "REQUEST_MERCHANT_LIST_REPORT_EXPORT_JOB_REPORT",
          "request-merchant-list-report-export-job-member",
          "request-merchant-list-report-export-job-member-group",
          "export-job-request"
      )

    public static readonly REQUEST_CUSTOMER_LIST_EXPORT_JOB_REPORT =
    new KafkaReportExportJobTypeEventConstant(
      "REQUEST_CUSTOMER_LIST_EXPORT_JOB_REPORT",
      "request-customer-list-export-job-report-member",
      "request-customer-list-export-job-report-member-group",
      "export-job-request"
    )
    public static readonly REQUEST_AFFECTED_MERCHANTS_EXPORT_JOB_REPORT = new KafkaReportExportJobTypeEventConstant(
      "REQUEST_AFFECTED_MERCHANTS_EXPORT_JOB_REPORT",
      "request-affected-merchants-export-report-member",
      "request-affected-merchants-export-report-member-group",
      "export-job-request"
    )
  private readonly TOPIC_PREFIX = `${process.env.DEPLOYMENT_NAMESPACE}_`;
  constructor(
    public readonly name: string,
    public readonly topicName: string,
    public readonly groupId: string,
    public readonly key: string
  ) {
    super(name);
    this.topicName = topicName;
    this.groupId = groupId;
  }
  public static getValues(): KafkaReportExportJobTypeEventConstant[] {
    return [
      this.REQUEST_EXPORT_EXCEL_REPORT,
      this.REQUEST_TRANSACTION_EXPORT,
      this.REQUEST_SOA_EXCEL_REPORT,
      this.REQUEST_DISCOUNT_REPORT_EXPORT_JOB_REPORT,
      this.REQUEST_MERCHANT_SETTLEMENT_REPORT_EXPORT_JOB_REPORT,
      this.REQUEST_MERCHANT_LIST_REPORT_EXPORT_JOB_REPORT,
      this.REQUEST_CUSTOMER_LIST_EXPORT_JOB_REPORT,
      this.REQUEST_AFFECTED_MERCHANTS_EXPORT_JOB_REPORT
    ];
  }
  public static getByName(name: string) {
    let results = this.getValues().filter((item) => item.name === name);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }
  public getTopicName(): string {
    return this.TOPIC_PREFIX + this.topicName;
  }
  public getGroupId(): string {
    return this.TOPIC_PREFIX + this.groupId;
  }

  public getKey(): string {
    return this.key;
  }
}
