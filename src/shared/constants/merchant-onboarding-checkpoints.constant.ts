import { EnumType } from "./enum-type.constant";

export class MerchantOnboardingCheckpointsConstant extends EnumType<MerchantOnboardingCheckpointsConstant>{
    public static readonly BUSINESS_DETAIL = new MerchantOnboardingCheckpointsConstant('BUSINESS_DETAIL', 'Business Detail', 1);
    public static readonly PAP_INFO = new MerchantOnboardingCheckpointsConstant('PAP_INFO', 'Pap info', 2);
    public static readonly CONTACT_DETAIL = new MerchantOnboardingCheckpointsConstant('CONTACT_DETAIL', 'Contact Detail', 3);
    public static readonly SETTLEMENT_DETAIL = new MerchantOnboardingCheckpointsConstant('SETTLEMENT_DETAIL', 'Settlement Detail', 4);
    public static readonly KYM_DETAIL = new MerchantOnboardingCheckpointsConstant('KYM_DETAIL', 'KYM Detail', 5);
    public static readonly COMPANY_DOCUMENT = new MerchantOnboardingCheckpointsConstant('COMPANY_DOCUMENT', 'Company Document', 6);
    public static readonly OWNER_DOCUMENT = new MerchantOnboardingCheckpointsConstant('OWNER_DOCUMENT', 'Owner Document', 7);

    constructor (public readonly name: string, public readonly displayname: string, public readonly position: number) {
        super(name);
        this.displayname = displayname;
        this.position = position;
    }

    public static getValues(): MerchantOnboardingCheckpointsConstant[] {
        return [
            this.BUSINESS_DETAIL,
            this.PAP_INFO,
            this.CONTACT_DETAIL,
            this.SETTLEMENT_DETAIL,
            this.KYM_DETAIL,
            this.COMPANY_DOCUMENT,
            this.OWNER_DOCUMENT
        ]
    }
    public static getByName(name: string) {
        let results = this.getValues().filter(item => item.name === name);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }

    public static getNames() {
        const transactionStatus: string[] = this.getValues().map(txnStatus => {
            return txnStatus.name;
        });
        return transactionStatus;
    }

    public static getCheckpointsInOrderByName(name:string):Array<string> { 
        let position = this.getByName(name).position;
        let results = this.getValues().filter(item => item.position <= position).map(filteredData => filteredData.name);
        return results;
    }

    public static getPositionOfCheckpoint(name: string) { 
        return this.getByName(name)?.position;
    }
    public static comparePapPosition(incomingPAPRequest:string, existingPAP:string):string { 
        const incomingPAPPosition = this.getByName(incomingPAPRequest);
        const existingPAPPosition = this.getByName(existingPAP);

        if (incomingPAPPosition.position > existingPAPPosition.position) { 
            return incomingPAPPosition.name; // pap1 is greater
        }
        if (incomingPAPPosition === existingPAPPosition) {
            return incomingPAPPosition.name; // pap1 and pap2 is equal
        }
        if (incomingPAPPosition < existingPAPPosition) {
            return existingPAPPosition.name; // pap2 is greater
        }
    }
}