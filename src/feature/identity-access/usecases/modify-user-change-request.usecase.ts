import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { WorkflowTask } from "@app/shared/entities/workflow-task.entity";
import { SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserChangeRequest } from "../entities/user-change-request.entity";
import { BankBranchesRepository } from "../repositories/bank-branches.repository";
import { BankBranchesDbRepository } from "../repositories/db/bank-branches.repository";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { ModifyUserChangeRequestUsecaseRequest } from "./requests/modify-user-change-request.usecase.request";
import { ModifyUserChangeRequestUsecaseResponse } from "./response/modify-user-change-request.usecase.response";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
@Injectable()
export class ModifyUserChangeRequestUsecase implements Usecase<ModifyUserChangeRequestUsecaseRequest,ModifyUserChangeRequestUsecaseResponse>{
    constructor(
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
		@Inject(UserChangeRequestDbRepository) private readonly userChangeRequestRepository?: UserChangeRequestRepository,
        @Inject(BankBranchesDbRepository) private readonly bankBranchesRepository?: BankBranchesRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository,
    ){}
    async execute(request: ModifyUserChangeRequestUsecaseRequest, requestContext?: RequestContext): Promise<Result<ModifyUserChangeRequestUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        if(loggedInUser === request.userId) Result.createError(new ForbiddenException("User cannot modify itself!"));
        const changeRequest = await this.findChangeRequest(request.userId,request.changeRequestId);
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
    private async findChangeRequest(refId: string, changeRequestId: string): Promise<UserChangeRequest> {
        return await this.userChangeRequestRepository.findChangeRequestByRefIdAndRequestId(refId,changeRequestId);
    }
    private async findLastChangeRequestTask(requestId:string): Promise<WorkflowTask> {
        return await this.workflowTaskRepository.findlatestChangeRequestTask(requestId);
    }
    private async findWorkflowProcess(workflowGrp: string, workflowType: string, processId: string): Promise<WorkflowDetail> {
        return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(workflowGrp,workflowType,processId);
    }
    private async editChangeRequest(currentWorkflowProcess: WorkflowDetail, changeRequest: UserChangeRequest, request: ModifyUserChangeRequestUsecaseRequest): Promise<void> {
        if (!currentWorkflowProcess.previousItem) {
            if(!request.userName && !request.employeeId && !request.branch && !request.roles){
                Result.createError(new BadRequestException("Please edit requested changes"));
            }else{
                changeRequest.userId = request.email;
                changeRequest.userName = request.userName;
                changeRequest.employeeId = request.employeeId;
                changeRequest.active = request.active;
                if(request.branch){
                    const bankBranch = await this.bankBranchesRepository.findById(request.branch);
                    if (!bankBranch) {
                        Result.createErrorWithMessage(new NotFoundException(),"Cannot find branch");
                    }
                    const branch = new SelectMenu(bankBranch.name,bankBranch.id);
                    changeRequest.branch = branch;
                }
                if(request.roles){
                    changeRequest.roles = await this.rolesRepository.findRolesInIdList(request.roles);
                }
                await this.userChangeRequestRepository.update(changeRequest);
            }
        }
    }
}