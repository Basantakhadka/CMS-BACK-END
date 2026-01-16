import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Type } from "@app/feature/common/error";
import { ErrorDetail } from "@app/feature/common/error_detail";
import { Result } from "@app/feature/common/result";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
import { WorkflowGroupType, WorkflowType } from "CMS-BACK-END/src/shared/constants/workflow-group.constant";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { IdGenerator, IdType } from "CMS-BACK-END/src/shared/id-generator";
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Role, RoleChangeRequest } from "../entities/roles.entity";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserRepository } from "../repositories/user.repository";
import { AddRoleUsecaseRequest } from "./requests/add-role.usecase.request";
import { AddRoleUsecaseResponse } from "./response/add-role.usecase.response";
import { WorkflowActor } from "CMS-BACK-END/src/shared/constants/workflow-actors.constant";
import { WorkflowTaskMaker } from "CMS-BACK-END/src/shared/usecase/workflow-task-maker";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
@Injectable()
export class AddRoleUsecase extends WorkflowTaskMaker<RoleChangeRequest,AddRoleUsecaseRequest> implements Usecase<AddRoleUsecaseRequest, AddRoleUsecaseResponse>{
    constructor(
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository
    ){super()}
    async execute(request: AddRoleUsecaseRequest, requestContext: RequestContext): Promise<Result<AddRoleUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const firstWorkflowProcess = await this.findFirstWorkflowProcess();
        const user = await this.userRepository.findById(loggedInUser);
        const isPermission = await this.checkPermission(firstWorkflowProcess, user);
		if(!isPermission){
            return Result.createError(new ForbiddenException("You do not have permission to create!"));
        }
        const secondWorkflowProcess = await this.findSecondWorkflowProcess(firstWorkflowProcess);
        const changeRequest = await this.prepareChangedData(request, loggedInUser, secondWorkflowProcess);
        const workflowGrpStatus = (await this.workflowDetailsRepository.findById(WorkflowGroupType.ICW.name))?.active;
        //initializing usecase to use abstract methods
        const addRoleUsecase = new AddRoleUsecase(this.userRepository, this.workflowDetailsRepository);
        const workflowRequestorTask = await addRoleUsecase.prepareRequestorTaskData(changeRequest.id,WorkflowGroupType.ICW.name,WorkflowGroupType.ICW.name,loggedInUser,firstWorkflowProcess,workflowGrpStatus);
        await this.workflowTaskRepository.insert(workflowRequestorTask);
        
        const secondWorkflowTsk = await addRoleUsecase.prepareSecondChangeRequestTaskData(workflowRequestorTask,secondWorkflowProcess);
        await this.workflowTaskRepository.insert(secondWorkflowTsk);
        
        //finally saving change request to roles change request table
        await this.rolesRepository.insertChangeRequest(changeRequest);
        const response = new AddRoleUsecaseResponse(changeRequest.id,changeRequest.refId);
        return Result.createSuccess(response);
    }
    
    protected async prepareChangedData(request: AddRoleUsecaseRequest, loggedInUser: string,nextWorkflowProcess: WorkflowDetail): Promise<RoleChangeRequest>{
        const todayDate = DateUtils.getCurrentFullDate();
        const changeRequest = new RoleChangeRequest();
        changeRequest.id = IdGenerator.generateId();
        changeRequest.refId = IdGenerator.generateId();
        changeRequest.type = ChangeRequestType.ADD.name;
        changeRequest.requestedOn = DateUtils.convertToString(todayDate);
		const user = await this.userRepository.findById(loggedInUser);
        changeRequest.requestedBy = new LabelValuePair(user.userName, loggedInUser);
        changeRequest.title = request.title;
        changeRequest.active= request.active;
        changeRequest.createdOn = DateUtils.convertToString(todayDate);
        changeRequest.permissions = request.permission;
        if(nextWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name){
            changeRequest.nextActor = WorkflowActor.REVIEWER.name;
            changeRequest.status = ChangeRequestStatus.IN_REVIEW.name;
        }
        if(nextWorkflowProcess?.data.type === WorkflowActor.APPROVER.name){
            changeRequest.nextActor = WorkflowActor.APPROVER.name;
            changeRequest.status = ChangeRequestStatus.IN_APPROVAL.name;
        }
        changeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.IN_PROGRESS.name;
        return changeRequest;
    }
    protected async findFirstWorkflowProcess(): Promise<WorkflowDetail> {
        const workflowDetails: WorkflowDetail[] = await this.workflowDetailsRepository.findAllWorkflowDetails(WorkflowGroupType.ICW.name,WorkflowGroupType.ICW.name);
        const firstWorkflowProcess = workflowDetails?.find((process)=> !process.previousItem);
        return firstWorkflowProcess;
    }
    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }
    protected async findSecondWorkflowProcess(firstWorkflowProcess:WorkflowDetail): Promise<WorkflowDetail> {
        return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(
            WorkflowGroupType.ICW.name,WorkflowGroupType.ICW.name, firstWorkflowProcess.nextItem
        );
    }
}