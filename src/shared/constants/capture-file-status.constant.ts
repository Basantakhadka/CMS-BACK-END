import { EnumType } from "./enum-type.constant";

export class CaptureFileStatus extends EnumType<CaptureFileStatus> {
  public static readonly PROCESSING = new CaptureFileStatus(
    "PROCESSING",
    "Processing File"
  );
  public static readonly UPLOADED = new CaptureFileStatus(
    "UPLOADED",
    "Uploaded"
  );
  public static readonly PROCESSING_FAILED = new CaptureFileStatus(
    "PROCESSING_FAILED",
    "Processing Failed"
  );
  public static readonly PARSING_FILE = new CaptureFileStatus(
    "PARSING_FILE",
    "Parsing File"
  );
  public static readonly GENERATED = new CaptureFileStatus(
    "GENERATED",
    "generated"
  );
  public static readonly GENERATION_FAILED = new CaptureFileStatus(
    "GENERATION_FAILED",
    "Generation Failed"
  );

  private constructor(
    public readonly name: string,
    public readonly displayName: string
  ) {
    super(name);
    this.displayName = displayName;
  }

  public static getValues(): CaptureFileStatus[] {
    return [
      this.PROCESSING,
      this.UPLOADED,
      this.PROCESSING_FAILED,
      this.GENERATED,
    ];
  }

  public static getByName(name: string) {
    let results = this.getValues().filter((item) => item.name === name);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }
}
