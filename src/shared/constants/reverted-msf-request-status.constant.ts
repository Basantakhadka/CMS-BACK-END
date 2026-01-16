import { EnumType } from "./enum-type.constant";

export class RevertedRequestStatus extends EnumType<RevertedRequestStatus>{
    public static readonly REVERTED_TO_REVIEWER = new RevertedRequestStatus('REVERTED_TO_REVIEWER', 'Reverted To Reviewer');
    public static readonly REVERTED_TO_EDITOR = new RevertedRequestStatus('REVERTED_TO_EDITOR', 'Reverted To Editor');
    public static readonly REVERTED_TO_APPROVER = new RevertedRequestStatus('REVERTED_TO_APPROVER', 'Reverted To Approver');
    public static readonly REVERTED_TO_MAKERS = new RevertedRequestStatus('REVERTED_TO_MAKERS', 'Reverted To Makers');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():RevertedRequestStatus[]{
        return[
            this.REVERTED_TO_REVIEWER,
            this.REVERTED_TO_EDITOR,
            this.REVERTED_TO_APPROVER,
            this.REVERTED_TO_MAKERS
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