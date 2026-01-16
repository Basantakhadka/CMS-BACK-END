import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class RevertChangeRequestUsecaseRequest implements UsecaseRequest {
  constructor(
    public changeRequestId: string,
    public referenceId: string,
    public comment: string
  ) {}
}
