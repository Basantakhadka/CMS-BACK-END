import { EnumType } from "./enum-type.constant";

export class DisputeCategory extends EnumType<DisputeCategory>{
    public static readonly UNAUTHORIZED_CHARGE = new DisputeCategory('UNAUTHORIZED_CHARGE', 'Unauthorized Charge');
    public static readonly OVER_CHARGE =  new DisputeCategory('OVER_CHARGE','Over Charge');
    public static readonly ISSUE_WITH_FULFILLMENT =  new DisputeCategory('ISSUE_WITH_FULFILLMENT','Issue with Fulfillment');
    public static readonly CHARGEBACKS =  new DisputeCategory('CHARGEBACKS','Chargebacks');
    public static readonly UNSETTLED_AMOUNTS =  new DisputeCategory('UNSETTLED_AMOUNTS','Unsettled Amounts');
    public static readonly OTHERS =  new DisputeCategory('OTHERS','Others');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():DisputeCategory[]{
        return[
            this.UNAUTHORIZED_CHARGE,
            this.OVER_CHARGE,
            this.ISSUE_WITH_FULFILLMENT,
            this.CHARGEBACKS,
            this.UNSETTLED_AMOUNTS,
            this.OTHERS
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