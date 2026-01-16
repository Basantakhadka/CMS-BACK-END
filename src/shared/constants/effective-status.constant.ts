import { EnumType } from "./enum-type.constant";

export class EffectiveStatus extends EnumType<EffectiveStatus>{ 
    public static readonly ACTIVE = new EffectiveStatus('ACTIVE', 'Active');
    public static readonly ARCHIVE = new EffectiveStatus('ARCHIVE', 'Archive');

    constructor(public readonly name: string, public readonly displayName: string){
        super(name); 
        this.displayName = displayName
    }

    public static getValues(): EffectiveStatus[] {
        return [
            this.ACTIVE,
            this.ARCHIVE
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