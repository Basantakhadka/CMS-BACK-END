import { EnumType } from "./enum-type.constant";

export class DateTimePatternType extends EnumType<DateTimePatternType> {
  public static readonly DD_MM_YYYY = new DateTimePatternType('DD_MM_YYYY', 'dd/mm/yyyy');

  public static readonly MM_DD_YYYY = new DateTimePatternType('MM_DD_YYYY', 'mm/dd/yyyy');
  public static readonly YYYY_MM_DD_HM = new DateTimePatternType('YYYY_MM_DD_HM', 'YYYY-MM-DD, h:mmam/pm');

  public static readonly YYYY_MM_DD = new DateTimePatternType('YYYY_MM_DD', 'yyyy/mm/dd');
  public static readonly DD_MMM_YYYY = new DateTimePatternType('DD_MMM_YYYY', 'dd MMM yyyy');
  public static readonly MMM_DD_YYYY = new DateTimePatternType('MMM_DD_YYYY', 'MMM dd, yyyy');
  public static readonly MMM_DD_YYYY_HMS = new DateTimePatternType('MMM_DD_YYYY_HMS', 'ddd DD MMM, YYYY hh:mm A');
  public static readonly dd_DD_MM_YYYY = new DateTimePatternType('dd_DD_MM_YYYY', 'dd-mm-yyyy');

  public static readonly HH_MM_SS_AMPM = new DateTimePatternType(
    "HH_MM_SS_AMPM",
    "hh:mm:ss appm"
  );


  constructor (public readonly name: string, public readonly displayname: string) {
    super(name);
    this.displayname = displayname;
  }

  public static getValues(): DateTimePatternType[] {
    return [
      this.DD_MM_YYYY,
      this.MM_DD_YYYY,
      this.YYYY_MM_DD,
      this.DD_MMM_YYYY,
      this.MMM_DD_YYYY,
      this.MMM_DD_YYYY_HMS,
      this.dd_DD_MM_YYYY,
      this.HH_MM_SS_AMPM
    ]
  }

  public static getByName(name: string) {
    let results = this.getValues().filter(item => item.name === name);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }
}
