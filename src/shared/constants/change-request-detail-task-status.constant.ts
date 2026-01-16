import { EnumType } from "./enum-type.constant";

export class TaskStatus extends EnumType<TaskStatus>{
    public static readonly ASSIGNED = new TaskStatus('ASSIGNED', 'Assigned');
    public static readonly COMPLETED =  new TaskStatus('COMPLETED','Completed')
    public static readonly REVERTED = new TaskStatus('REVERTED', 'Reverted')

    constructor(public readonly name:string, public readonly displayname:string){
        super(name);
        this.displayname = displayname;
    }
    public static getValues():TaskStatus[]{
        return[
            this.ASSIGNED, this.COMPLETED, this.REVERTED
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