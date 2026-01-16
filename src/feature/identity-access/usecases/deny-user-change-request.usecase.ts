import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { WorkflowTask } from "@app/shared/entities/workflow-task.entity";
import { RejectRequest } from "CMS-BACK-END/src/shared/usecase/workflow-reject-request";
import { Inject, NotFoundException } from "@nestjs/common";
import { BadRequestException, ForbiddenException } from "@nestjs/common/exceptions";
import { UserChangeRequest } from "../entities/user-change-request.entity";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { UserRepository } from "../repositories/user.repository";
import { DenyUserChangeRequestUsecaseRequest } from "./requests/deny-user-change-request.usecase.request";
import { DenyUserChangeRequestUsecaseResponse } from "./response/deny-user-change-request.usecase.response";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";

export class DenyUserChangeRequestUsecase extends RejectRequest<UserChangeRequest> implements Usecase<DenyUserChangeRequestUsecaseRequest, DenyUserChangeRequestUsecaseResponse>{
    constructor (
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository: WorkflowGroupRepository,
        @Inject(UserChangeRequestDbRepository) private readonly userChangeRequestRepository: UserChangeRequestRepository,
        @Inject(UserDbRepository) private readonly userRepository: UserRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository: WorkflowTasksRepository,
    ) { super() }
    async execute(request: DenyUserChangeRequestUsecaseRequest, requestContext?: RequestContext): Promise<Result<DenyUserChangeRequestUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const lastWorkflowTask = await this.findLastChangeRequestTask(request.id);
        const user = await this.userRepository.findById(loggedInUser);
        const currentworkflowProcess = await this.findWorkflowProcess(lastWorkflowTask.workflowGroupId,lastWorkflowTask.workflowId,lastWorkflowTask.stepId);
        await this.checkPermission(currentworkflowProcess, user);
        if(loggedInUser === request.refId) Result.createError(new ForbiddenException("User cannot reject its change request!"));
        const savedChangeRequest = await this.findChangeRequest(request.refId, request.id);
            if (
                requestContext.getCurrentUser()?.loginId ===
                savedChangeRequest?.requestedBy?.value
            ) {
                return Result.createErrorWithMessage(
                    new BadRequestException(),
                    "User cannot deny its own change request!"
                );
            }
        const completePrevTask = await this.revertPreviousChangeRequestTask(lastWorkflowTask, loggedInUser);
        await this.workflowTaskRepository.update(completePrevTask);

        const rejectTaskLog = await this.addNewTaskLogAsRejected(lastWorkflowTask, loggedInUser, request.denialReason);
        await this.workflowTaskRepository.insert(rejectTaskLog);

        const userAsLabelValue = new LabelValuePair(user.userName, loggedInUser);

        const updatedRoleChangeRequest = await this.rejectChangeRequest(savedChangeRequest, userAsLabelValue, request.denialReason);
        updatedRoleChangeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.COMPLETE.name;
        await this.userChangeRequestRepository.update(updatedRoleChangeRequest);

        const response = new DenyUserChangeRequestUsecaseResponse();
        return Result.createSuccessWithMessage(response, "Change request denied");
    }
    protected async findChangeRequest(refId: string, changeRequestId: string): Promise<UserChangeRequest> {
        const changeRequest = new UserChangeRequest();
        changeRequest.refId = refId;
        changeRequest.id = changeRequestId;
        const savedChangeRequest = (await this.userChangeRequestRepository.findByIds(changeRequest))[0];
        if (!savedChangeRequest) {
            Result.createError(new NotFoundException(`Request with ID ${ refId } not found!`));
        }
        if (savedChangeRequest.status === ChangeRequestStatus.REJECTED.name || savedChangeRequest.status === ChangeRequestStatus.APPROVED.name) {
            Result.createError(new BadRequestException(`Request with ID ${ refId } is already ${ savedChangeRequest.status.toLowerCase() }!`));
        }
        return savedChangeRequest;
    }
    protected async findLastChangeRequestTask(requestId: string): Promise<WorkflowTask> {
        const workflowTask = await this.workflowTaskRepository.findlatestChangeRequestTask(requestId);
        if (!workflowTask) {
            Result.createError(new NotFoundException("Change request task Not Found!"));
        }
        return workflowTask;
    }
    protected async findWorkflowProcess(workflowGrp: string, workflowType: string, processId: string): Promise<WorkflowDetail> {
        return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(workflowGrp,workflowType,processId);
    }
}