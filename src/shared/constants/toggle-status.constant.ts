import { LabelValuePair } from "../entities/label-value-pair.view";
import { EnumType } from "./enum-type.constant";

export class ToggleStatusConstant extends EnumType<ToggleStatusConstant>{
    public static readonly ENABLED = new ToggleStatusConstant('ENABLED', 'Enabled');
    public static readonly DISABLED = new ToggleStatusConstant('DISABLED', 'Disabled');

    constructor (public readonly name: string, public readonly displayname: string,) {
        super(name);
        this.displayname = displayname
    }

    public static getValues(): ToggleStatusConstant[] {
        return [
            this.ENABLED,
            this.DISABLED
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