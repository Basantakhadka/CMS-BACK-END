import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
import { WorkflowGroupType } from "CMS-BACK-END/src/shared/constants/workflow-group.constant";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Role, RoleChangeRequest } from "../entities/roles.entity";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UpdateRoleUsecaseRequest } from "./requests/update-role.usecase.request";
import { UpdateRoleUsecaseResponse } from "./response/update-role.usecase.response";
import { WorkflowActor } from "CMS-BACK-END/src/shared/constants/workflow-actors.constant";
import { WorkflowTaskMaker } from "CMS-BACK-END/src/shared/usecase/workflow-task-maker";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class UpdateRoleUsecase extends WorkflowTaskMaker<RoleChangeRequest,UpdateRoleUsecaseRequest> implements Usecase<UpdateRoleUsecaseRequest, UpdateRoleUsecaseResponse>{
    constructor(
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository
    ){super()}
    async execute(request: UpdateRoleUsecaseRequest, requestContext:RequestContext): Promise<Result<UpdateRoleUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);
        const firstWorkflowProcess = await this.findFirstWorkflowProcess();
        const isPermission = await this.checkPermission(firstWorkflowProcess, user);
		if(!isPermission){
            return Result.createError(new ForbiddenException("You do not have permission to edit!"));
        }
        user.roles.forEach((item)=>{
            if(item.value === request.id) Result.createError(new ForbiddenException("User cannot modify its role!"));
        })
        let savedData: Role;
        await this.rolesRepository.findById(request.id).then((data)=>savedData = data);
        if(!savedData){
            return Result.createErrorWithMessage(new NotFoundException(), "Role Not Found!")   
        }
        const savedChangeRequest = await this.rolesRepository.findChangeRequestByRefIdAndStatus(request.id, ChangeRequestOutcomeStatus.IN_PROGRESS.name);
        if(savedChangeRequest.length>0){
            return Result.createErrorWithMessage(new BadRequestException(),"Request is already pending for this role!");
        }
        const secondWorkflowProcess = await this.findSecondWorkflowProcess(firstWorkflowProcess);
        const changeRequest = await this.prepareChangedData(request,loggedInUser,secondWorkflowProcess);
        
        const updateRoleUsecase = new UpdateRoleUsecase(this.userRepository, this.workflowDetailsRepository);
        
        const workflowRequestorTask = await this.prepareRequestorTaskData(changeRequest.id,WorkflowGroupType.IMW.name,WorkflowGroupType.IMW.name,loggedInUser,firstWorkflowProcess,true);
        await this.workflowTaskRepository.insert(workflowRequestorTask);
        
        const secondWorkflowTsk = await this.prepareSecondChangeRequestTaskData(workflowRequestorTask,secondWorkflowProcess);
        await this.workflowTaskRepository.insert(secondWorkflowTsk);

        await this.rolesRepository.insertChangeRequest(changeRequest);
        const response = new UpdateRoleUsecaseResponse(changeRequest.refId,changeRequest.id);
        return Result.createSuccess(response);
    }
    protected async prepareChangedData(request: UpdateRoleUsecaseRequest, loggedInUser: string, nextWorkflowProcess: WorkflowDetail): Promise<RoleChangeRequest>{
        const todayDate = DateUtils.getCurrentFullDate();
        const role = new Role();
        role.id = request.id;
        const changeRequest = new RoleChangeRequest();
        changeRequest.refId = role.id;
        changeRequest.id = IdGenerator.generateId();
        changeRequest.type = ChangeRequestType.UPDATE.name;
        changeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.IN_PROGRESS.name;
        changeRequest.requestedOn = DateUtils.convertToString(todayDate);
        const user = await this.userRepository.findById(loggedInUser);
        changeRequest.requestedBy = new LabelValuePair(user.userName, loggedInUser);
        changeRequest.title = request.title;
        changeRequest.active = request.active;
        let savedData: Role;
        await this.rolesRepository.findById(request.id).then((data)=>savedData = data);
        changeRequest.createdOn = DateUtils.formatDate(new Date(savedData.createdOn).toISOString());
        changeRequest.permissions = request.permissions;
        if(nextWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name){
            changeRequest.nextActor = WorkflowActor.REVIEWER.name;
            changeRequest.status = ChangeRequestStatus.IN_REVIEW.name;
        }
        if(nextWorkflowProcess?.data.type === WorkflowActor.APPROVER.name){
            changeRequest.nextActor = WorkflowActor.APPROVER.name;
            changeRequest.status = ChangeRequestStatus.IN_APPROVAL.name;
        }
        return changeRequest;
    }
    protected async findFirstWorkflowProcess(): Promise<WorkflowDetail> {
        const workflowDetails: WorkflowDetail[] = await this.workflowDetailsRepository.findAllWorkflowDetails(WorkflowGroupType.IMW.name,WorkflowGroupType.IMW.name);
        const firstWorkflowProcess = workflowDetails?.find((process)=> !process.previousItem);
        return firstWorkflowProcess;
    }
    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }
    protected async findSecondWorkflowProcess(firstWorkflowProcess:WorkflowDetail): Promise<WorkflowDetail> {
        return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(
            WorkflowGroupType.IMW.name,WorkflowGroupType.IMW.name, firstWorkflowProcess.nextItem
        );
    }
}