import { EnumType } from "./enum-type.constant";

export class JobStatusConstant extends EnumType<JobStatusConstant>{
    public static readonly SUCCESS = new JobStatusConstant('SUCCESS', 'Success');
    public static readonly FAILED = new JobStatusConstant('FAILED', 'Failed');
    public static readonly PROCESSING = new JobStatusConstant('PROCESSING', 'Processing');
    constructor (public readonly name: string, public readonly displayname: string) {
        super(name);
        this.displayname = displayname;
    }
    public static getValues(): JobStatusConstant[] {
        return [
            this.SUCCESS,
            this.FAILED,
            this.PROCESSING,
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