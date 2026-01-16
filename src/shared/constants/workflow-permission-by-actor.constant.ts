import { checkArgument } from "../utils/common.utils";
import { EnumType } from "./enum-type.constant";
import { WorkflowActor } from "./workflow-actors.constant";

export class WorkflowPermissionByActor extends EnumType<WorkflowActor> {
  public static readonly ADD = new WorkflowPermissionByActor("ADD", [
    WorkflowActor.MAKERS,
  ]);
  public static readonly UPDATE = new WorkflowPermissionByActor("UPDATE", [
    WorkflowActor.EDITOR,
    WorkflowActor.MAKERS,
  ]);

  public static readonly REQUEST_FOR_CHANGE = new WorkflowPermissionByActor(
    "REQUEST_FOR_CHANGE",
    [WorkflowActor.EDITOR, WorkflowActor.REVIEWER, WorkflowActor.APPROVER]
  );

  public static readonly REJECT = new WorkflowPermissionByActor("REJECT", [
    WorkflowActor.APPROVER,
    WorkflowActor.REVIEWER,
  ]);

  public static readonly VERIFY = new WorkflowPermissionByActor("VERIFY", [
    WorkflowActor.EDITOR,
    WorkflowActor.REVIEWER,
    WorkflowActor.APPROVER,
  ]);

  public static readonly APPROVE = new WorkflowPermissionByActor("APPROVE", [
    WorkflowActor.APPROVER,
  ]);

  constructor(public readonly name: string, public actors: WorkflowActor[]) {
    super(name);
  }

  public static getValues(): WorkflowPermissionByActor[] {
    return [
      this.ADD,
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

  public hasPermission(role: string[] | string) {
    checkArgument(role, "array");
    checkArgument(role, "string");
    if (typeof role === "string") {
      return this.actors.map((actor) => actor.name).includes(role);
    }
    return role.some((role) =>
      this.actors.map((actor) => actor.name).includes(role)
    );
  }
}
