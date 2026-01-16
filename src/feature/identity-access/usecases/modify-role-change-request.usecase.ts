import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { WorkflowTask } from "@app/shared/entities/workflow-task.entity";
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RoleChangeRequest } from "../entities/roles.entity";
import { BankBranchesRepository } from "../repositories/bank-branches.repository";
import { BankBranchesDbRepository } from "../repositories/db/bank-branches.repository";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { ModifyRoleChangeRequestUsecaseRequest } from "./requests/modify-role-change-request.usecase.request";
import { ModifyRoleChangeRequestUsecaseResponse } from "./response/modify-role-change-request.usecase.response";
import { UserRepository } from "../repositories/user.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
@Injectable()
export class ModifyRoleChangeRequestUsecase implements Usecase<ModifyRoleChangeRequestUsecaseRequest,ModifyRoleChangeRequestUsecaseResponse>{
    constructor(
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
		@Inject(UserChangeRequestDbRepository) private readonly userChangeRequestRepository?: UserChangeRequestRepository,
        @Inject(BankBranchesDbRepository) private readonly bankBranchesRepository?: BankBranchesRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository,
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
    ){}
    async execute(request: ModifyRoleChangeRequestUsecaseRequest, requestContext?: RequestContext): Promise<Result<ModifyRoleChangeRequestUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const user = await this.userRepository.findById(loggedInUser);
        user.roles.forEach((item)=>{
            if(item.value === request.roleId) Result.createError(new ForbiddenException("User cannot modify its role!"));
        })
        const changeRequest = await this.findChangeRequest(request.roleId,request.changeRequestId);
        if(!changeRequest){
            Result.createError(new NotFoundException(`Change request with Id '${request.changeRequestId}' not found!`));
        }
        const lastChangeRequestTask = await this.findLastChangeRequestTask(request.changeRequestId);
        if(!lastChangeRequestTask){
            return Result.createErrorWithMessage(new NotFoundException(),"Change request task Not Found!");
        }
        const isPermission= JSON.parse(lastChangeRequestTask.taskAssignedTo).allowedUsers.allowedUsers.includes(loggedInUser);
        const isRestricted = JSON.parse(lastChangeRequestTask.taskAssignedTo).allowedUsers.restrictUsers?.includes(loggedInUser);
        if(!isPermission || isRestricted){
            return Result.createErrorWithMessage(new ForbiddenException(),"You do not have permission to approve!");
        }
        const currentworkflowProcess: WorkflowDetail= await this.findWorkflowProcess(lastChangeRequestTask.workflowGroupId,lastChangeRequestTask.workflowId,lastChangeRequestTask.stepId);
        await this.editChangeRequest(currentworkflowProcess,changeRequest,request);
    }
    protected async findChangeRequest(refId: string, changeRequestId: string): Promise<RoleChangeRequest> {
        return await this.rolesRepository.findChangeRequestByRefIdAndRequestId(refId,changeRequestId);
    }
    private async findLastChangeRequestTask(requestId:string): Promise<WorkflowTask> {
        return await this.workflowTaskRepository.findlatestChangeRequestTask(requestId);
    }
    private async findWorkflowProcess(workflowGrp: string, workflowType: string, processId: string): Promise<WorkflowDetail> {
        return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(workflowGrp,workflowType,processId);
    }
    protected async editChangeRequest(currentWorkflowProcess: WorkflowDetail, changeRequest: RoleChangeRequest, request: ModifyRoleChangeRequestUsecaseRequest): Promise<void>{
        if(!currentWorkflowProcess.previousItem){
            if(!request.title && !request.active && !request.permissions){
                Result.createError(new BadRequestException("Please edit requested changes"));
            }else{
                changeRequest.title = request.title;
                changeRequest.active = request.active;
                changeRequest.permissions = request.permissions;
                await this.rolesRepository.insertChangeRequest(changeRequest);
            }
        }
    }
}