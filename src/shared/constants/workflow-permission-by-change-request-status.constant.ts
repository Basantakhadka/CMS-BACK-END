import { ChangeRequestStatus } from "./change-request-status.constant";
import { EnumType } from "./enum-type.constant";
import { WorkflowActor } from "./workflow-actors.constant";

export class  WorkflowPermissionByChangeRequestStatus extends EnumType<ChangeRequestStatus> {
  public static readonly UPDATE = new WorkflowPermissionByChangeRequestStatus(
    "UPDATE",
    [ChangeRequestStatus.IN_EDIT, ChangeRequestStatus.REQUEST_FOR_CHANGE, ChangeRequestStatus.DRAFT]
  );

  public static readonly REQUEST_FOR_CHANGE =
    new WorkflowPermissionByChangeRequestStatus("REQUEST_FOR_CHANGE", [
      ChangeRequestStatus.IN_EDIT,
      ChangeRequestStatus.IN_REVIEW,
      ChangeRequestStatus.REQUEST_FOR_CHANGE,
      ChangeRequestStatus.IN_APPROVAL,
      ChangeRequestStatus.PENDING,
    ]);

  public static readonly REJECT = new WorkflowPermissionByChangeRequestStatus(
    "REJECT",
    [ChangeRequestStatus.IN_APPROVAL, ChangeRequestStatus.IN_REVIEW]
  );

  public static readonly VERIFY = new WorkflowPermissionByChangeRequestStatus(
    "VERIFY",
    [ChangeRequestStatus.IN_REVIEW, ChangeRequestStatus.IN_EDIT]
  );

  public static readonly APPROVE = new WorkflowPermissionByChangeRequestStatus(
    "APPROVE",
    [ChangeRequestStatus.IN_APPROVAL]
  );

  constructor(
    public readonly name: string,
    public statuses: ChangeRequestStatus[]
  ) {
    super(name);
  }

  public static getValues(): WorkflowPermissionByChangeRequestStatus[] {
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

  public hasPermission(status: string) {
    return this.statuses.map((status) => status.name).includes(status);
  }
}
