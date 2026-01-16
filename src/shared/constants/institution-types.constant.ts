import { EnumType } from "./enum-type.constant";

export class InstitutionTypes extends EnumType<InstitutionTypes>{
    public static readonly ACQUIRER = new InstitutionTypes('ACQUIRER', 'Acquirer');
    public static readonly ISSUER = new InstitutionTypes('ISSUER', 'Issuer');
    public static readonly BOTH = new InstitutionTypes(
        "BOTH",
        "Both (Acquirer/Issuer)"
    );

    constructor (public readonly name: string, public readonly displayname: string) {
        super(name);
        this.displayname = displayname;
    }

    public static getValues(): InstitutionTypes[] {
        return [
            this.ACQUIRER,
            this.ISSUER,
            this.BOTH,
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