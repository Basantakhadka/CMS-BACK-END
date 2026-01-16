import { EnumType } from "./enum-type.constant";
import { WorkflowActor } from "./workflow-actors.constant";

export class TaskType extends EnumType<TaskType> {
  public static readonly REQUEST = new TaskType("REQUEST", "Request");
  public static readonly EDIT = new TaskType("EDIT", "Edit");
  public static readonly REVIEW = new TaskType("REVIEW", "Review");
  public static readonly VERIFY = new TaskType("VERIFY", "Verify");
  public static readonly MAKER = new TaskType("MAKER", "Maker");
  public static readonly REJECT = new TaskType("REJECT", "Reject");

  constructor(
    public readonly name: string,
    public readonly displayname: string
  ) {
    super(name);
    this.displayname = displayname;
  }

  public static getValues(): TaskType[] {
    return [
      this.REQUEST,
      this.EDIT,
      this.REVIEW,
      this.VERIFY,
      this.MAKER,
      this.REJECT,
    ];
  }
  public static getByName(name: string) {
    let results = this.getValues().filter((item) => item.name === name);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }

  public static getByWorkflowActor(workflowActor: string): TaskType {
    if (workflowActor === WorkflowActor.REVIEWER.name) {
      return TaskType.REVIEW;
    }
    if (workflowActor === WorkflowActor.EDITOR.name) {
      return TaskType.EDIT;
    }
    if (workflowActor === WorkflowActor.APPROVER.name) {
      return TaskType.VERIFY;
    }
    if (workflowActor === WorkflowActor.MAKERS.name) {
      return TaskType.MAKER;
    }
  }
}
