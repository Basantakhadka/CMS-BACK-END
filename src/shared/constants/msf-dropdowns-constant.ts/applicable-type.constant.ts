import { ValueWithLabelEnumType } from "./value-with-label-enum-type.constant";

export class ApplicableType extends ValueWithLabelEnumType<ApplicableType>{
  public static readonly WHICH_EVER_HIGHER = new ApplicableType('WHICHEVER_HIGHER', 'Whichever is Higher');
  public static readonly COMBINED = new ApplicableType('COMBINATION', 'Combination');

  private constructor(public readonly value: string, public readonly label: string) {
    super(value);
    this.label=label
  }
  public static getValues(): ApplicableType[] {
    return [
      this.WHICH_EVER_HIGHER,
      this.COMBINED,
    ];
  }
  public static getByName(value : string){
    let results = this.getValues().filter(item => item.value === value);
    if(results && results.length > 0){
      return results[0];
    }
    return null;
  }
}
