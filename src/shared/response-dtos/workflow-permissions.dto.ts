interface IWorkflowPermissions {
  ADD?: boolean;
  UPDATE: boolean;
  REQUEST_FOR_CHANGE: boolean;
  REJECT: boolean;
  VERIFY: boolean;
  APPROVE: boolean;
}
export class WorkflowPermissions implements IWorkflowPermissions {
  ADD: boolean = false;
  UPDATE: boolean;
  REQUEST_FOR_CHANGE: boolean;
  REJECT: boolean;
  VERIFY: boolean;
  APPROVE: boolean;

  constructor({
    ADD,
    UPDATE,
    REQUEST_FOR_CHANGE,
    REJECT,
    VERIFY,
    APPROVE,
  }: IWorkflowPermissions) {
    this.ADD = ADD || false;
    this.UPDATE = UPDATE || false;
    this.REQUEST_FOR_CHANGE = REQUEST_FOR_CHANGE || false;
    this.REJECT = REJECT || false;
    this.VERIFY = VERIFY || false;
    this.APPROVE = APPROVE || false;
  }
}
