import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { TaskStatus } from "CMS-BACK-END/src/shared/constants/change-request-detail-task-status.constant";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { WorkflowTask } from "@app/shared/entities/workflow-task.entity";
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Role, RoleChangeRequest } from "../entities/roles.entity";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { ApproveNewRoleChangeRequestUsecaseRequest } from "./requests/new-role-approve-change-request.usecase.request";
import { ApproveNewRoleChangeRequestUsecaseResponse } from "./response/new-role-approve-change-request.usecase.response";
import { WorkflowTaskApprover } from "CMS-BACK-END/src/shared/usecase/workflow-task-approve";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
import { UserRepository } from "../repositories/user.repository";
import {CacheFactory} from "CMS-BACK-END/src/core/cache/cache.factory";
@Injectable()
export class ApproveNewRoleChangeRequestUsecase extends WorkflowTaskApprover<RoleChangeRequest,ApproveNewRoleChangeRequestUsecaseRequest> implements Usecase<ApproveNewRoleChangeRequestUsecaseRequest,ApproveNewRoleChangeRequestUsecaseResponse>{
    constructor(
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository,
        private cacheFactory?: CacheFactory
    ){
        super();
    }
    async execute(request: ApproveNewRoleChangeRequestUsecaseRequest, requestContext?: RequestContext): Promise<Result<ApproveNewRoleChangeRequestUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        console.log({requestContext});
        const user = await this.userRepository.findById(loggedInUser);
        const lastChangeRequestTask = await this.findLastChangeRequestTask(request.changeRequestId);
        if(!lastChangeRequestTask){
            return Result.createErrorWithMessage(new NotFoundException(),"Change request task Not Found!");
        }
        const currentworkflowProcess: WorkflowDetail= await this.findWorkflowProcess(lastChangeRequestTask.workflowGroupId,lastChangeRequestTask.workflowId,lastChangeRequestTask.stepId);
        await this.checkPermission(currentworkflowProcess, user);
        user.roles.forEach((item)=>{
            if(item.value === request.roleId) Result.createError(new ForbiddenException("User cannot modify its role!"));
        })
        const changeRequest = await this.findChangeRequest(request.roleId,request.changeRequestId);
        if(!changeRequest){
            return Result.createErrorWithMessage(new NotFoundException(),`Change request with Id '${request.changeRequestId}' not found!`);
        }
        if(changeRequest.requestedBy.value=== loggedInUser){
            return Result.createError(new BadRequestException("User cannot approve its own change request!"));
        }
        if(changeRequest.status === ChangeRequestStatus.APPROVED.name){
            return Result.createErrorWithMessage(new BadRequestException(),"Task already approved!");
        }
        const prevWorkflowTask = await this.workflowTaskRepository.findTaskByIdAndStepCounter(lastChangeRequestTask.requestId, lastChangeRequestTask.stepCounter-1 );
        if(currentworkflowProcess?.previousItem && prevWorkflowTask.taskStatus === TaskStatus.REVERTED.name){
            return Result.createErrorWithMessage(new BadRequestException(),"Cannot approve this change request!");
        }
        const approveNewRoleChangeRequestUsecase = new ApproveNewRoleChangeRequestUsecase(this.workflowDetailsRepository,this.userRepository);
        //update prev request task status to complete 
        const updatedPrevTask = await approveNewRoleChangeRequestUsecase.completePreviousChangeRequestTask(lastChangeRequestTask,loggedInUser);
        await this.workflowTaskRepository.update(updatedPrevTask);
        const userAsLabelValue = new LabelValuePair(user.userName, loggedInUser);
        if(!currentworkflowProcess?.nextItem){
            if(changeRequest){
                const updatedChangeRequest = await this.setChangeRequestStatusToApprovedIfApprovedByMainApprover(changeRequest,userAsLabelValue);
                updatedChangeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.COMPLETE.name;
                await this.rolesRepository.updateChangeRequest(updatedChangeRequest);
                //update role/ add new if approved by main approver
                await this.changeApprovedRoleData(changeRequest, requestContext);
            }
        }else{
            const nextworkflowProcess: WorkflowDetail= await this.findWorkflowProcess(lastChangeRequestTask.workflowGroupId,lastChangeRequestTask.workflowId,currentworkflowProcess.nextItem);
            //insert new task 
            const newTask = await this.addChangeRequestTaskAccordingToWorkflow(lastChangeRequestTask,nextworkflowProcess);
            await this.workflowTaskRepository.insert(newTask);

            //update role change request to approval pending
            const updatedRoleChangeRequest = await this.updateChangeRequestStatus(changeRequest,userAsLabelValue,nextworkflowProcess);
            await this.rolesRepository.insertChangeRequest(updatedRoleChangeRequest);
        }
        const response = new ApproveNewRoleChangeRequestUsecaseResponse(request.changeRequestId);
        return Result.createSuccess(response);
    }
    protected async findChangeRequest(refId: string, changeRequestId: string): Promise<RoleChangeRequest> {
        return await this.rolesRepository.findChangeRequestByRefIdAndRequestId(refId,changeRequestId);
    }
    protected async findLastChangeRequestTask(requestId:string): Promise<WorkflowTask> {
        return await this.workflowTaskRepository.findlatestChangeRequestTask(requestId);
    }
    protected async findWorkflowProcess(workflowGrp: string, workflowType: string, processId: string): Promise<WorkflowDetail> {
        return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(workflowGrp,workflowType,processId);
    }
    protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
        return await this.userRepository.findUsersByRoleId(role);
    }
    protected async changeApprovedRoleData(changeRequest: RoleChangeRequest, requestContext?: RequestContext){
        const role = new Role();
        role.id = changeRequest.refId;
        if(changeRequest.type !== ChangeRequestType.ADD.name){
            const savedRole = await this.rolesRepository.findById(changeRequest.refId);
            role.createdOn = savedRole.createdOn;
        }
        if(changeRequest.type === ChangeRequestType.DELETE.name){
            role.deleted = true;
            role.deletedBy = changeRequest.requestedBy;
            role.deletedOn = changeRequest.requestedOn;
            await this.userRepository.deleteUsersByRole(role.id);
        }else{
            role.active = changeRequest.active;
            role.title = changeRequest.title;
            role.permissions = changeRequest.permissions;
            if(changeRequest.type === ChangeRequestType.UPDATE.name){
                role.lastModifiedBy = changeRequest.requestedBy;
                role.lastModifiedOn = changeRequest.requestedOn;
            }
            else if(changeRequest.type === ChangeRequestType.ADD.name){
                role.createdBy = changeRequest.requestedBy;
                role.createdOn = changeRequest.requestedOn;
                role.deleted = false;
            }
        }

        if(changeRequest.type === ChangeRequestType.DELETE.name){
            await this.deleteCachedRole(`permission:${requestContext.getCurrentUser().institutionCode}:${role.id}`)
        }

        if(changeRequest.type === ChangeRequestType.UPDATE.name){
            await this.deleteCachedRole(`permission:${requestContext.getCurrentUser().institutionCode}:${role.id}`)
            await this.cacheRole(`permission:${requestContext.getCurrentUser().institutionCode}:${role.id}`, role.permissions)
        }

        if(changeRequest.type === ChangeRequestType.ADD.name){
            await this.cacheRole(`permission:${requestContext.getCurrentUser().institutionCode}:${role.id}`, role.permissions)
        }

        await this.rolesRepository.save(role);
    }

    private async deleteCachedRole(key: string){
        await this.cacheFactory.deleteCachedData(key);
    }

    private async cacheRole(key: string, value: any){
        await this.cacheFactory.cacheData(key, value);
    }
}