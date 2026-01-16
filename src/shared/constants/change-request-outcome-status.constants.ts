import { ChangeRequestStatus } from "./change-request-status.constant";
import { EnumType } from "./enum-type.constant";

export class ChangeRequestOutcomeStatus extends EnumType<ChangeRequestOutcomeStatus>{
    public static readonly IN_PROGRESS = new ChangeRequestOutcomeStatus('IN_PROGRESS', 'In Progress', [ChangeRequestStatus.IN_APPROVAL.name, ChangeRequestStatus.IN_FEE_SETUP.name, ChangeRequestStatus.IN_REVIEW.name, ChangeRequestStatus.PENDING.name, ChangeRequestStatus.REQUEST_FOR_CHANGE.name]);
    public static readonly COMPLETE =  new ChangeRequestOutcomeStatus('COMPLETE','COMPLETE', [ChangeRequestStatus.APPROVED.name, ChangeRequestStatus.CANCELED.name, ChangeRequestStatus.REJECTED.name]);

    constructor(public readonly name:string, public readonly displayname:string, public readonly status:Array<string>){
        super(name);
        this.displayname = displayname;
        this.status = status;
    }

    public static getValues():ChangeRequestOutcomeStatus[]{
        return[
            this.IN_PROGRESS,
            this.COMPLETE
        ]
    }
    public static getByName(name : string){
        let results = this.getValues().filter(item => item.name === name);
        if(results && results.length > 0){
          return results[0];
        }
        return null;
    }

    public static getByStatus(name: string): string{
        for(const value of this.getValues()){
            if(value.status.includes(name)){
                return value.name;
            }
        }
        return null;
    }
}