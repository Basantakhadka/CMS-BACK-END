import { UsecaseResponse } from "CMS-BACK-END/src/core/usecase/usecase.response";
import { WorkflowPermissions } from "CMS-BACK-END/src/shared/response-dtos/workflow-permissions.dto";


export class GetChangeRequestPermissionsUsecaseResponse implements UsecaseResponse{
    constructor(
        public permissions: WorkflowPermissions,
    ){}
}