import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";
import { Role, RoleChangeRequest } from "../entities/roles.entity";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { DeleteRoleUsecaseRequest } from "./requests/delete-role.usecase.request";
import { DeleteRoleUsecaseResponse } from "./response/delete-role.usecase.response";
import { BadRequestException, ForbiddenException } from "@nestjs/common/exceptions";
import { UserDbRepository } from "../repositories/db/user.repository";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
import { WorkflowTaskMaker } from "CMS-BACK-END/src/shared/usecase/workflow-task-maker";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { WorkflowActor } from "CMS-BACK-END/src/shared/constants/workflow-actors.constant";
import { WorkflowGroupType } from "CMS-BACK-END/src/shared/constants/workflow-group.constant";
import { UserByRole } from "../entities/user.entity";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { UserRepository } from "../repositories/user.repository";
@Injectable()
export class DeleteRoleUsecase extends WorkflowTaskMaker<RoleChangeRequest,DeleteRoleUsecaseRequest> implements Usecase<DeleteRoleUsecaseRequest, DeleteRoleUsecaseResponse>{
    constructor(
        @Inject(UserDbRepository) private readonly userRepository: UserRepository,
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository,
    ){super()}
    async execute(request: DeleteRoleUsecaseRequest, requestContext:RequestContext): Promise<Result<DeleteRoleUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);
        const firstWorkflowProcess = await this.findFirstWorkflowProcess();
        const isPermission = await this.checkPermission(firstWorkflowProcess, user);
		if(!isPermission){
            return Result.createError(new ForbiddenException("You do not have permission to delete!"));
        }
        user.roles.forEach((item)=>{
            if(item.value === request.roleId) Result.createError(new ForbiddenException("User cannot delete its role!"));
        })
        let savedRole: Role = await this.rolesRepository.findById(request.roleId);
        if(!savedRole || savedRole?.deleted){
            Result.createErrorWithMessage(new NotFoundException(),"Role Not Found!")
        }
        const usersByRole: UserByRole[] = await this.getUsersbyRole(request.roleId);
        if (usersByRole.length > 0) {
            const users = await this.userRepository.findUsersInIds(usersByRole.map((item) => item.userId));
            users.forEach((item) => {
                if (item.active) {
                    return Result.createError(new BadRequestException("Cannot delete. Role assigned to active user!"));
                }
            });
        }
        await this.validatePendingRequest(request.roleId);
        const secondWorkflowProcess = await this.findSecondWorkflowProcess(firstWorkflowProcess);
        const changeRequest = await this.prepareChangedData(request,loggedInUser,secondWorkflowProcess);
        const updateUserUsecase = new DeleteRoleUsecase(this.userRepository, this.workflowDetailsRepository);
        
        //saving requestor task 
        const workflowRequestorTask = await this.prepareRequestorTaskData(changeRequest.id,WorkflowGroupType.IMW.name,WorkflowGroupType.IMW.name,loggedInUser,firstWorkflowProcess,true);
        await this.workflowTaskRepository.insert(workflowRequestorTask);
        
        //saving task and assigned to actor in next workflow process
        const secondWorkflowTsk = await this.prepareSecondChangeRequestTaskData(workflowRequestorTask,secondWorkflowProcess);
        await this.workflowTaskRepository.insert(secondWorkflowTsk);
       
        //finally saving change request to users change request table
        changeRequest.requestedBy =  new LabelValuePair(user.userName, loggedInUser);
        await this.rolesRepository.insertChangeRequest(changeRequest);
        
        const response = new DeleteRoleUsecaseResponse(request.roleId,changeRequest.id);
        return Result.createSuccessWithMessage(response,"Role Delete Request Sent");
    }

    protected async findFirstWorkflowProcess(): Promise<WorkflowDetail> {
		const workflowDetails: WorkflowDetail[] = await this.workflowDetailsRepository.findAllWorkflowDetails(WorkflowGroupType.IMW.name,WorkflowGroupType.IMW.name);
        const firstWorkflowProcess = workflowDetails?.find((process)=> !process.previousItem);
        return firstWorkflowProcess;
	}

	protected async findSecondWorkflowProcess(firstWorkflowProcess: WorkflowDetail): Promise<WorkflowDetail> {
		return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(
            WorkflowGroupType.IMW.name,WorkflowGroupType.IMW.name, firstWorkflowProcess.nextItem
        );
	}

	protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
		return await this.userRepository.findUsersByRoleId(role);
	}

    protected async prepareChangedData(request: DeleteRoleUsecaseRequest, loggedInUser: string, nextWorkflowProcess: WorkflowDetail): Promise<RoleChangeRequest> {
        const changeRequest = new RoleChangeRequest();
        changeRequest.refId = request.roleId;
        changeRequest.id = IdGenerator.generateId();
        const todayDate = DateUtils.getCurrentFullDate();
        changeRequest.requestedOn = DateUtils.convertToString(todayDate);
        changeRequest.type = ChangeRequestType.DELETE.name;
        changeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.IN_PROGRESS.name;
        if(nextWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name){
            changeRequest.nextActor = WorkflowActor.REVIEWER.name;
            changeRequest.status = ChangeRequestStatus.IN_REVIEW.name;
        }
        if(nextWorkflowProcess?.data.type === WorkflowActor.APPROVER.name){
            changeRequest.nextActor = WorkflowActor.APPROVER.name;
            changeRequest.status = ChangeRequestStatus.IN_APPROVAL.name;
        }
        const savedRole: Role = await this.rolesRepository.findById(request.roleId);
        changeRequest.title = savedRole.title;
        changeRequest.active= savedRole.active;
        changeRequest.permissions = savedRole.permissions;
        changeRequest.createdOn = DateUtils.formatDate(new Date(savedRole.createdOn).toISOString());
        return changeRequest;
    }

    private async validatePendingRequest(id:string):Promise<RoleChangeRequest>{
        const savedChangeRequest = await this.rolesRepository.findChangeRequestByRefIdAndStatus(id, ChangeRequestOutcomeStatus.IN_PROGRESS.name);
        if(savedChangeRequest.length>0){
            Result.createErrorWithMessage(new BadRequestException(),"Request is already pending for this role!");
        }
        return savedChangeRequest[0];
    }
}