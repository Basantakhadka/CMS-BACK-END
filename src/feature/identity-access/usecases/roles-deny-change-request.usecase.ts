import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RoleChangeRequest } from "../entities/roles.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { RolesDenyChangeRequestUsecaseRequest } from "./requests/roles-deny-change-request.usecase.request";
import { RolesDenyChangeRequestUsecaseResponse } from "./response/roles-deny-change-request.usecase.response";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { RejectRequest } from "CMS-BACK-END/src/shared/usecase/workflow-reject-request";
import { WorkflowTask } from "@app/shared/entities/workflow-task.entity";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { UserRepository } from "../repositories/user.repository";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
@Injectable()
export class RolesDenyChangeRequestUsecase extends RejectRequest<RoleChangeRequest> implements Usecase<RolesDenyChangeRequestUsecaseRequest,RolesDenyChangeRequestUsecaseResponse>{
    constructor(
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository: WorkflowGroupRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository: RolesRepository,
        @Inject(UserDbRepository) private readonly userRepository: UserRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository: WorkflowTasksRepository
    ){super()}
    async execute(request: RolesDenyChangeRequestUsecaseRequest, requestContext: RequestContext): Promise<Result<RolesDenyChangeRequestUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);
        const lastWorkflowTask = await this.findLastChangeRequestTask(request.id);
        const currentworkflowProcess = await this.findWorkflowProcess(lastWorkflowTask.workflowGroupId,lastWorkflowTask.workflowId,lastWorkflowTask.stepId);
        await this.checkPermission(currentworkflowProcess, user);
        user.roles.forEach((item)=>{
            if(item.value === request.roleId) Result.createError(new ForbiddenException("User cannot modify its role!"));
        })
        const savedChangeRequest = await this.findChangeRequest(request.roleId, request.id);
        if (
            requestContext.getCurrentUser()?.loginId === savedChangeRequest?.requestedBy?.value
        ) {
            return Result.createError(
                new BadRequestException("User cannot deny its own change request!"),
            );
        }
        const revertPrevTask = await this.revertPreviousChangeRequestTask(lastWorkflowTask, loggedInUser);
        await this.workflowTaskRepository.update(revertPrevTask);

        const rejectTaskLog = await this.addNewTaskLogAsRejected(lastWorkflowTask, loggedInUser, request.deniedReason);
        await this.workflowTaskRepository.insert(rejectTaskLog);

        const userAsLabelValue = new LabelValuePair(user.userName, loggedInUser);

        const updatedRoleChangeRequest = await this.rejectChangeRequest(savedChangeRequest, userAsLabelValue, request.deniedReason);
        updatedRoleChangeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.COMPLETE.name;
        await this.rolesRepository.updateChangeRequest(updatedRoleChangeRequest);

        const response = new RolesDenyChangeRequestUsecaseResponse(savedChangeRequest.id);
        return Result.createSuccessWithMessage(response,"Change Request Rejected!");
    }
    protected async findChangeRequest(refId: string, changeRequestId: string): Promise<RoleChangeRequest> {
        const changeRequest = new RoleChangeRequest();
        changeRequest.refId = refId;
        changeRequest.id = changeRequestId;
        const savedChangeRequest = (await this.rolesRepository.findChangeRequestById(changeRequest))[0];
        if(!savedChangeRequest){
            Result.createError(new NotFoundException(`Change request not found!`));
        }
        if(savedChangeRequest.status === ChangeRequestStatus.REJECTED.name || savedChangeRequest.status === ChangeRequestStatus.APPROVED.name){
            Result.createError(new BadRequestException(`Change request is already ${savedChangeRequest.status.toLowerCase()}!`));
        }
        return savedChangeRequest;
    }
    protected async findLastChangeRequestTask(requestId: string): Promise<WorkflowTask> {
        const workflowTask = await this.workflowTaskRepository.findlatestChangeRequestTask(requestId);
        if(!workflowTask){
            Result.createError(new NotFoundException("Change request task Not Found!"));
        }
        return workflowTask;
    }
    protected async findWorkflowProcess(workflowGrp: string, workflowType: string, processId: string): Promise<WorkflowDetail> {
        return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(workflowGrp,workflowType,processId);
    }
}