import { EnumType } from "./enum-type.constant";

export class WorkflowAssignTo extends EnumType<WorkflowAssignTo>{
    public static readonly ALL = new WorkflowAssignTo('allUsers', 'All');
    public static readonly SPECIFIC =  new WorkflowAssignTo('specificUsers','Specific Users');

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }

    public static getValues():WorkflowAssignTo[]{
        return[
            this.ALL, this.SPECIFIC
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