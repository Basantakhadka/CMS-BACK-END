import { EnumType } from "./enum-type.constant";

export class TransactionMode extends EnumType<TransactionMode>{
    public static readonly OFF_US = new TransactionMode('OFF_US', 'Off-us');
    public static readonly ON_US =  new TransactionMode('ON_US','On-us');
    public static readonly DOMESTIC_OFF_US = new TransactionMode('DOMESTIC_OFF_US', 'Domestic Off-us');
    public static readonly DOMESTIC_ON_US =  new TransactionMode('DOMESTIC_ON_US','Domestic On-us');
    public static readonly INTERNATIONAL_OFF_US = new TransactionMode('INTERNATIONAL_OFF_US', 'International Off-us');
    public static readonly INTERNATIONAL = new TransactionMode('INTERNATIONAL', 'International');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():TransactionMode[]{
        return[
            this.OFF_US,
            this.ON_US,
            this.DOMESTIC_OFF_US,
            this.DOMESTIC_ON_US,
            this.INTERNATIONAL_OFF_US,
            this.INTERNATIONAL
        ]
    }
    public static getByName(name : string){
        let results = this.getValues().filter(item => item.name === name);
        if(results && results.length > 0){
          return results[0];
        }
        return null;
    }
    public static getNames(): Array<string>{
        let response: Array<string> = [];
        let results = this.getValues().map(type=>{
            response.push(type.name);
        });
        return response;
    }
}