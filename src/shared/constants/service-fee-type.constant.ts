import { EnumType } from "./enum-type.constant";

export class ServiceFeeType extends EnumType<ServiceFeeType>{
    public static readonly MSF = new ServiceFeeType('MSF', 'MSF');
    public static readonly CSF =  new ServiceFeeType('CSF','CSF');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }
    public static getValues():ServiceFeeType[]{
        return[
            this.MSF,
            this.CSF
        ]
    }
    public static getByName(name : string){
        let results = this.getValues().filter(item => item.name === name);
        if(results && results.length > 0){
          return results[0];
        }
        return null;
    }
}