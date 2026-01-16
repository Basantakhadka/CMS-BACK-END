import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { ApplicationStatus } from "CMS-BACK-END/src/shared/constants/application-status.constant";
import { TaskStatus } from "CMS-BACK-END/src/shared/constants/change-request-detail-task-status.constant";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { WorkflowGroupType } from "CMS-BACK-END/src/shared/constants/workflow-group.constant";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { WorkflowTask } from "@app/shared/entities/workflow-task.entity";
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RoleChangeRequest } from "../entities/roles.entity";
import { UserByRole } from "../entities/user.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserRepository } from "../repositories/user.repository";
import { ChangeNewRoleRequestUsecaseRequest } from "./requests/change-new-role-change-request.usecase.request";
import { ChangeNewRoleRequestUsecaseResponse } from "./response/change-new-role-change-request.usecase.response";
import { WorkflowTaskChangeRequest } from "CMS-BACK-END/src/shared/usecase/workflow-task-change-request";
@Injectable()
export class ChangeNewRoleRequestUsecase extends WorkflowTaskChangeRequest<RoleChangeRequest> implements Usecase<ChangeNewRoleRequestUsecaseRequest,ChangeNewRoleRequestUsecaseResponse>{
    constructor(
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository
    ){
        super();
    }
    async execute(request: ChangeNewRoleRequestUsecaseRequest, requestContext?: RequestContext): Promise<Result<ChangeNewRoleRequestUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
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
            return Result.createErrorWithMessage(new NotFoundException(),`Request not found!`);
        }
        const userAsLabelValue = new LabelValuePair(user.userName, loggedInUser);
        
        if(!currentworkflowProcess?.nextItem && lastChangeRequestTask.taskStatus === TaskStatus.COMPLETED.name){
            return Result.createErrorWithMessage(new BadRequestException(),"Task already approved!");
        }
        if(!currentworkflowProcess?.previousItem){
            return Result.createErrorWithMessage(new BadRequestException,"Task already assigned to Makers");
        }else{
            const changeNewRoleRequestUsecase = new ChangeNewRoleRequestUsecase(this.workflowDetailsRepository);
            //update previous task status to REVERTED
            const revertedChangeRequest = await changeNewRoleRequestUsecase.revertPreviousChangeRequestTask(lastChangeRequestTask,loggedInUser,request.comments);
            await this.workflowTaskRepository.insert(revertedChangeRequest);

            //add new task assigning to users in previous workflow process
            const previousWorkflowProcess = await this.findWorkflowProcess(lastChangeRequestTask.workflowGroupId,lastChangeRequestTask.workflowId,currentworkflowProcess?.previousItem);
            const newChangeRequestTask = await this.addRequestorChangeRequest(lastChangeRequestTask,previousWorkflowProcess);
            await this.workflowTaskRepository.insert(newChangeRequestTask);

            //update role change request to status Request for change
            const roleChangeRequest = await this.updateChangeRequestStatus(changeRequest,userAsLabelValue,previousWorkflowProcess)
            await this.rolesRepository.insertChangeRequest(roleChangeRequest);

            const response = new ChangeNewRoleRequestUsecaseResponse(request.changeRequestId,request.roleId);
            return Result.createSuccessWithMessage(response, "Change Request Sent.");
        }
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
}