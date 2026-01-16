import { EnumType } from "./enum-type.constant";

export class FormatNumberConstant extends EnumType<FormatNumberConstant>{
    public static readonly INTERNATIONAL_WITH_2_DECIMAL = new FormatNumberConstant('INTERNATION_WITH_2_DECIMAL', '###,###,###,###,###,###.00');
    public static readonly INTERNATIONAL_WITH_4_DECIMAL = new FormatNumberConstant('INTERNATION_WITH_4_DECIMAL', '###,###,###,###,###,###.0000');

    constructor (public readonly name: string, public readonly displayName: string) {
        super(name);
        this.displayName = displayName;
    }
    public static getValues(): FormatNumberConstant[] {
        return [
            this.INTERNATIONAL_WITH_2_DECIMAL,
            this.INTERNATIONAL_WITH_4_DECIMAL
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