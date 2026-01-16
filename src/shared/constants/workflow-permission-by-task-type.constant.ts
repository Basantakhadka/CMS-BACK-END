import { checkArgument } from "../utils/common.utils";
import { TaskType } from "./change-request-detail-task-type.constant";
import { EnumType } from "./enum-type.constant";
import { WorkflowActor } from "./workflow-actors.constant";

export class WorkflowPermissionByTaskType extends EnumType<TaskType> {
  public static readonly UPDATE = new WorkflowPermissionByTaskType("UPDATE", [
    TaskType.EDIT,
    TaskType.MAKER,
  ]);

  public static readonly REQUEST_FOR_CHANGE = new WorkflowPermissionByTaskType(
    "REQUEST_FOR_CHANGE",
    [TaskType.EDIT, TaskType.REVIEW, TaskType.VERIFY]
  );

  public static readonly REJECT = new WorkflowPermissionByTaskType("REJECT", [
    TaskType.VERIFY,
    TaskType.REVIEW,
  ]);

  public static readonly VERIFY = new WorkflowPermissionByTaskType("VERIFY", [
    TaskType.REVIEW,
    TaskType.EDIT,
  ]);

  public static readonly APPROVE = new WorkflowPermissionByTaskType("APPROVE", [
    TaskType.VERIFY,
  ]);

  constructor(public readonly name: string, public taskTypes: TaskType[]) {
    super(name);
  }

  public static getValues(): WorkflowPermissionByTaskType[] {
    return [
      this.UPDATE,
      this.REQUEST_FOR_CHANGE,
      this.REJECT,
      this.VERIFY,
      this.APPROVE,
    ];
  }

  public static getByName(name: string) {
    let results = this.getValues().filter((item) => item.name === name);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }

  public hasTask(type: string) {
    checkArgument(type, "string");
    return this.taskTypes.map((type) => type.name).includes(type);
  }
}
