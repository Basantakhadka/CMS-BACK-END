import { EnumType } from "./enum-type.constant";

export class ChangeRequestsEntityConstant extends EnumType<ChangeRequestsEntityConstant>{
    public static readonly NETWORK_PROCESSOR = new ChangeRequestsEntityConstant('NETWORK_PROCESSOR', 'Network Processor', '');
    public static readonly SCHEMES_AND_PROMOTIONS_DISCOUNT = new ChangeRequestsEntityConstant('SCHEMES_AND_PROMOTIONS_DISCOUNT', 'Discount', '');
    public static readonly SCHEMES_AND_PROMOTIONS_CASHBACK = new ChangeRequestsEntityConstant('SCHEMES_AND_PROMOTIONS_CASHBACK', 'Cashback', '');
    public static readonly RISK_MANAGEMENT = new ChangeRequestsEntityConstant('RISK_MANAGEMENT', 'Risk Management', '');
    public static readonly MERCHANT_OUTLET = new ChangeRequestsEntityConstant('MERCHANT_OUTLET', 'Outlet', 'outlet');
    public static readonly MERCHANT_PAP_AND_PAYMENT_MODE = new ChangeRequestsEntityConstant('MERCHANT_PAP_AND_PAYMENT_MODE', 'PAP/Payment Mode', 'papPaymentMode');
    public static readonly MERCHANT_INFO = new ChangeRequestsEntityConstant('MERCHANT_INFO', 'Merchant information', '');
    public static readonly MERCHANT_PAP = new ChangeRequestsEntityConstant('MERCHANT_PAP', 'PAP', 'individual-pap');
    public static readonly MERCHANT_PAYMENT_MODE = new ChangeRequestsEntityConstant('MERCHANT_PAYMENT_MODE', 'Payment Mode ', 'individual-paymentmode');
    public static readonly MERCHANT_EDIT = new ChangeRequestsEntityConstant('MERCHANT_EDIT', 'Merchant', 'merchant-edit');
     public static readonly MERCHANT_SETTLEMENT_EDIT = new ChangeRequestsEntityConstant('MERCHANT_SETTLEMENT_EDIT', 'Merchant', 'merchant-settlement-edit');
    public static readonly MERCHANT_SURCHARGE = new ChangeRequestsEntityConstant('MERCHANT_SURCHARGE', 'Merchant Surcharge', 'merchant-surcharge');

    constructor (public readonly name: string, public readonly displayname: string, public readonly route: string) {
        super(name);
        this.displayname = displayname;
        this.route = route; 
    }
    public static getValues(): ChangeRequestsEntityConstant[] {
        return [
					this.NETWORK_PROCESSOR,
					this.SCHEMES_AND_PROMOTIONS_DISCOUNT,
					this.SCHEMES_AND_PROMOTIONS_CASHBACK,
					this.RISK_MANAGEMENT,
					this.MERCHANT_OUTLET,
					this.MERCHANT_PAP_AND_PAYMENT_MODE,
					this.MERCHANT_PAP,
					this.MERCHANT_PAYMENT_MODE,
					this.MERCHANT_EDIT,
					this.MERCHANT_SETTLEMENT_EDIT,
                    this.MERCHANT_SURCHARGE
				];
    }
    public static getByName(name: string) {
        let results = this.getValues().filter(item => item.name === name);
        if (results && results.length > 0) {
            const selectedValue = results[0]; 
            let value;  

            if(selectedValue?.route !== ''){
                value = { 
                    ...selectedValue
                }
            }else{ 
                value = { 
                    displayname: selectedValue?.displayname, 
                    name: selectedValue?.name
                }
            }
            return value;
        }
        return null;
    }
}