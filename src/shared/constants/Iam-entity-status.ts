import { EnumType } from "./enum-type.constant";

export class IamEntityStatus extends EnumType<IamEntityStatus> {

  public static readonly ACTIVE = new IamEntityStatus('ACTIVE', 'Active', true, 'Enabled');
  public static readonly INACTIVE = new IamEntityStatus('INACTIVE', 'Inactive', false, 'Disabled');
  private constructor (public readonly name: string, public readonly displayName: string, public readonly boolValue: boolean, public readonly userStatus: string) {
    super(name);
    this.displayName = displayName;
    this.boolValue = boolValue;
    this.userStatus = userStatus;
  }

  public static getValues(): IamEntityStatus[] {
    return [
      this.ACTIVE,
      this.INACTIVE
    ];
  }

  public static getByName(name: string) {
    let results = this.getValues().filter(item => item.name === name);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }

  public static getByBoolValue(value: boolean) {
    let results = this.getValues().filter(item => item.boolValue === value);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }
}
