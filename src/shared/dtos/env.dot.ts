import { ExportReportConfigEnvDto } from "CMS-BACK-END/src/shared/dtos/export-report-config-env.dto";
import { ExportEmailConfigEnvDto } from "./export-email-config-env.dto";

/**
 * Represents the environment configuration type.
 */
export class EnvDto {
  /**
   * The export report configuration.
   * @type {ExportReportConfigEnvDto,ExportEmailConfigEnvDto}
   */
  EXPORT_REPORT_CONFIG: ExportReportConfigEnvDto;
  EMAIL_CONFIG: ExportEmailConfigEnvDto;
}
