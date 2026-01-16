import { EnumType } from "../enum-type.constant";
export class ReportExportJobTypeEventConstant extends EnumType<ReportExportJobTypeEventConstant> {
  public static readonly REQUEST_EXPORT_EXCEL_REPORT =
    new ReportExportJobTypeEventConstant(
      "REQUEST_EXPORT_EXCEL_REPORT",
      "request-export-excel-report",
      "request-export-excel-report"
    );
  private readonly TOPIC_PREFIX = `${process.env.DEPLOYMENT_NAMESPACE}_`;
  constructor(
    public readonly name: string,
    public readonly topicName: string,
    public readonly groupId: string
  ) {
    super(name);
    this.topicName = topicName;
    this.groupId = groupId;
  }
  public static getValues(): ReportExportJobTypeEventConstant[] {
    return [this.REQUEST_EXPORT_EXCEL_REPORT];
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
}