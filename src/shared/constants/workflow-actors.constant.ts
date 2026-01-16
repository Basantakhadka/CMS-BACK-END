import { EnumType } from "./enum-type.constant";

export class WorkflowActor extends EnumType<WorkflowActor>{
    public static readonly REVIEWER = new WorkflowActor('REVIEWER', 'Reviewer');
    public static readonly EDITOR = new WorkflowActor('EDITOR', 'Editor');
    public static readonly APPROVER = new WorkflowActor('APPROVER', 'Approver');
    public static readonly MAKERS = new WorkflowActor('MAKERS', 'Makers');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():WorkflowActor[]{
        return[
            this.REVIEWER,
            this.EDITOR,
            this.APPROVER,
            this.MAKERS
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