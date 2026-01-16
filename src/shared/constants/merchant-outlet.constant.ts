import { LabelValuePair } from "../entities/label-value-pair.view";
import { EnumType } from "./enum-type.constant";

export class MerchantOutletPapType extends EnumType<MerchantOutletPapType>{
    public static readonly GROUP = new MerchantOutletPapType('GROUP', 'Group');
    public static readonly PAP = new MerchantOutletPapType('PAP', 'Payment Point');
    public static readonly DEFAULT = new MerchantOutletPapType('DEFAULT', 'Default');
  
    private constructor(public readonly name: string, public readonly displayName: string) {
      super(name);
      this.displayName = displayName;
    }
  
    public static getValues(): MerchantOutletPapType[]{
      return [
        this.GROUP,
        this.PAP,
        this.DEFAULT
      ];
    }
  
    public static getByName(name : string){
      let results = this.getValues().filter(item => item.name === name);
      if(results && results.length > 0){
        return results[0];
      }
      return null;
    }

    public static getPagTypeInLabelValuePair(name: string): LabelValuePair{
      const papType = this.getByName(name);
      return new LabelValuePair(papType.displayName, papType.name);
    }
  
  }