import { EnumType } from "./enum-type.constant";

export class KymStatusType extends EnumType<KymStatusType>{
    public static readonly VERIFIED = new KymStatusType('VERIFIED', 'Verified', true);
    public static readonly UNVERIFIED = new KymStatusType('UNVERIFIED', 'Unverified', false);

    constructor (
        public readonly name: string, 
        public readonly displayname: string,
        public readonly booleanValue: boolean
    ) {
        super(name);
    }

    public static getValues(): KymStatusType[] {
        return [
            this.VERIFIED,
            this.UNVERIFIED,
        ]
    }
    public static getByBooleanValue(booleanValue: boolean) {
        let results = this.getValues().filter(item => item.booleanValue === booleanValue);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }
}