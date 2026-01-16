import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";
import { BadRequestException, ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { UserChangeRequest } from "../entities/user-change-request.entity";
import { User, UserByRole } from "../entities/user.entity";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { UserRepository } from "../repositories/user.repository";

import { DeleteUserUsecaseRequest } from "./requests/delete-user.usecase.request";
import { DeleteUserUsecaseResponse } from "./response/delete-user.usecase.response";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { WorkflowActor } from "CMS-BACK-END/src/shared/constants/workflow-actors.constant";
import { WorkflowGroupType } from "CMS-BACK-END/src/shared/constants/workflow-group.constant";
import { WorkflowTaskMaker } from "CMS-BACK-END/src/shared/usecase/workflow-task-maker";

export class DeleteUserUsecase extends WorkflowTaskMaker<UserChangeRequest, DeleteUserUsecaseRequest> implements Usecase<DeleteUserUsecaseRequest, DeleteUserUsecaseResponse>{
    constructor (
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
        @Inject(UserChangeRequestDbRepository) private readonly userChangeRequestRepository?: UserChangeRequestRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository
    ) { super() }
    async execute(request: DeleteUserUsecaseRequest, requestContext?: RequestContext): Promise<Result<DeleteUserUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const firstWorkflowProcess = await this.findFirstWorkflowProcess();
        const user = await this.userRepository.findById(loggedInUser);
        const isPermission = await this.checkPermission(firstWorkflowProcess, user);
		if(!isPermission){
            return Result.createError(new ForbiddenException("You do not have permission to delete!"));
        }
        if(loggedInUser === request.id) Result.createError(new ForbiddenException("User cannot delete itself!"));
        const secondWorkflowProcess = await this.findSecondWorkflowProcess(firstWorkflowProcess);
        const changeRequest = await this.prepareChangedData(request, loggedInUser, secondWorkflowProcess);
        if (!(await this.validatePendingRequest(request.id))) {
            Result.createError(new BadRequestException(`Change request is already in progress`));
        };
        const updateUserUsecase = new DeleteUserUsecase(this.userRepository, this.workflowDetailsRepository);
        //saving requestor task 
        const workflowRequestorTask = await this.prepareRequestorTaskData(changeRequest.id, WorkflowGroupType.IMW.name, WorkflowGroupType.IMW.name, loggedInUser, firstWorkflowProcess, true);
        await this.workflowTaskRepository.insert(workflowRequestorTask);
        //saving task and assigned to reviewer
        const secondWorkflowTsk = await this.prepareSecondChangeRequestTaskData(workflowRequestorTask, secondWorkflowProcess);
        await this.workflowTaskRepository.insert(secondWorkflowTsk);
        //finally saving change request to users change request table
        await this.userChangeRequestRepository.insert(changeRequest);
        const response = new DeleteUserUsecaseResponse(changeRequest.id, changeRequest.refId);
        return Result.createSuccessWithMessage(response, "User deletion in progress");
    }
    protected async findFirstWorkflowProcess(): Promise<WorkflowDetail> {
        const workflowDetails: WorkflowDetail[] = await this.workflowDetailsRepository.findAllWorkflowDetails(WorkflowGroupType.IMW.name, WorkflowGroupType.IMW.name);
        return workflowDetails?.find((process) => !process.previousItem);
    }
    protected async findSecondWorkflowProcess(firstWorkflowProcess: WorkflowDetail): Promise<WorkflowDetail> {
        return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(
            WorkflowGroupType.IMW.name, WorkflowGroupType.IMW.name, firstWorkflowProcess.nextItem
        );
    }
    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }
    protected async prepareChangedData(request: DeleteUserUsecaseRequest, loggedInUser: string, nextWorkflowProcess: WorkflowDetail): Promise<UserChangeRequest> {
        const userChangeRequest = new UserChangeRequest();
        userChangeRequest.refId = request.id;
        userChangeRequest.id = IdGenerator.generateId();
        const savedUser = await this.validateSavedUser(request.id);
        userChangeRequest.branch = savedUser.branch;
        userChangeRequest.employeeId = savedUser.employeeId;
        userChangeRequest.roles = savedUser.roles;
        userChangeRequest.userId = savedUser.userId;
        userChangeRequest.userName = savedUser.userName;
        const user = await this.userRepository.findById(loggedInUser);
        userChangeRequest.requestedBy = new LabelValuePair(user.userName, loggedInUser);
        const todayDate = DateUtils.getCurrentFullDate();
        userChangeRequest.requestedOn = DateUtils.convertToString(todayDate);
        userChangeRequest.type = ChangeRequestType.DELETE.name;
        userChangeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.IN_PROGRESS.name;
        if (nextWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name) {
            userChangeRequest.nextActor = WorkflowActor.REVIEWER.name;
            userChangeRequest.status = ChangeRequestStatus.IN_REVIEW.name;
        }
        if (nextWorkflowProcess?.data.type === WorkflowActor.APPROVER.name) {
            userChangeRequest.nextActor = WorkflowActor.APPROVER.name;
            userChangeRequest.status = ChangeRequestStatus.IN_APPROVAL.name;
        }
        return userChangeRequest;
    }
    private async validateSavedUser(id: string) {
        const savedUser = await this.userRepository.findById(id);
        if (!savedUser) {
            throw new NotFoundException("User not found");
        }
        if (savedUser.deleted === true) {
            throw new NotFoundException("User already deleted");
        }
        return savedUser;
    }
    private async validatePendingRequest(id: string): Promise<boolean> {
        const savedUserChangeRequest = await this.userChangeRequestRepository.findCountByRefIdAndChangeRequestStatus(id, ChangeRequestOutcomeStatus.IN_PROGRESS.name);
        return (savedUserChangeRequest > 0) ? false : true;
    }
}