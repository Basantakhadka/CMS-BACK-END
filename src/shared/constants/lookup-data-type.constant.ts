import { EnumType } from "./enum-type.constant";

export class Currency extends EnumType<Currency>{
    public static readonly NPR = new Currency('NPR', 'Nepalese Rupee', 524);
    public static readonly INR = new Currency('INR', 'Indian Rupee', 356);
    public static readonly USD = new Currency('USD', 'US Dollar', 840);
    public static readonly TZS = new Currency('TZS', 'Tanzanian Shilling', 834)
    public static readonly EURO = new Currency('EURO', 'Euro', 978)



    constructor (public readonly name: string, public readonly displayname: string, public readonly number:number) {
        super(name);
        this.displayname = displayname
        this.number = number;
    }

    public static getValues(): Currency[] {
        return [
            this.NPR,
            this.INR,
            this.USD, 
            this.TZS,
            this.EURO
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

export class LookUpDataType extends EnumType<LookUpDataType>{
    public static readonly BANK = new LookUpDataType('BANK', 'Bank');
    public static readonly BANK_BRANCH = new LookUpDataType('BANK_BRANCH', 'Bank Branch');
    public static readonly COUNTRY = new LookUpDataType('COUNTRY', 'Country');
    public static readonly STATE = new LookUpDataType('STATE', 'State');
    public static readonly DISTRICT = new LookUpDataType('DISTRICT', 'District');
    public static readonly MUNICIPALITY = new LookUpDataType('MUNICIPALITY', 'Municipality');
    public static readonly CURRENCY = new LookUpDataType('CURRENCY', 'Currency');
    public static readonly EWALLET_AC = new LookUpDataType('EWALLET_AC', 'e-Wallet');
    public static readonly MCC = new LookUpDataType('MCC', 'Merchant Category');
    public static readonly BUSINESS_TYPE = new LookUpDataType('BUSINESS_TYPE', 'Business type');
    public static readonly SUB_BUSINESS_TYPE = new LookUpDataType('SUB_BUSINESS_TYPE', 'Sub business type');
    public static readonly NATIONALITY = new LookUpDataType('NATIONALITY', 'Nationality');
    public static readonly ID = new LookUpDataType('ID', 'Identification ');
    public static readonly WARD = new LookUpDataType('WARD', 'Ward')

    constructor (public readonly name: string, public readonly displayname: string) {
        super(name);
        this.displayname = displayname;
    }

    public static getValues(): LookUpDataType[] {
        return [
            this.BANK,
            this.BANK_BRANCH,
            this.COUNTRY,
            this.STATE,
            this.DISTRICT,
            this.MUNICIPALITY,
            this.CURRENCY,
            this.EWALLET_AC,
            this.MCC,
            this.BUSINESS_TYPE,
            this.SUB_BUSINESS_TYPE,
            this.NATIONALITY, 
            this.WARD
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