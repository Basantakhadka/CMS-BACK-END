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
import { UserChangeRequest } from "../entities/user-change-request.entity";
import { UserByRole } from "../entities/user.entity";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { UserRepository } from "../repositories/user.repository";
import { ChangeNewUserRequestUsecaseRequest } from "./requests/change-new-user-change-request.usecase.request";
import { ChangeNewUserRequestUsecaseResponse } from "./response/change-new-user-change-request.usecase.response";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { WorkflowTaskChangeRequest } from "CMS-BACK-END/src/shared/usecase/workflow-task-change-request";
@Injectable()
export class ChangeNewUserRequestUsecase extends WorkflowTaskChangeRequest<UserChangeRequest> implements Usecase<ChangeNewUserRequestUsecaseRequest,ChangeNewUserRequestUsecaseResponse>{
    constructor(
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
        @Inject(UserDbRepository) private readonly userRepository?: UserRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository,
        @Inject(UserChangeRequestDbRepository) private readonly userChangeRequestRepository?: UserChangeRequestRepository,
    ){
        super();
    }
    async execute(request: ChangeNewUserRequestUsecaseRequest, requestContext?: RequestContext): Promise<Result<ChangeNewUserRequestUsecaseResponse>> {
        const loggedInUser = requestContext.getCurrentUser().loginId;
        const lastChangeRequestTask = await this.findLastChangeRequestTask(request.changeRequestId);
        if(!lastChangeRequestTask){
            return Result.createErrorWithMessage(new NotFoundException(),"Change request task Not Found!");
        }
        const currentworkflowProcess: WorkflowDetail= await this.findWorkflowProcess(lastChangeRequestTask.workflowGroupId,lastChangeRequestTask.workflowId,lastChangeRequestTask.stepId);
        const user = await this.userRepository.findById(loggedInUser);
        await this.checkPermission(currentworkflowProcess, user);
        if(loggedInUser === request.userId) Result.createError(new ForbiddenException("User cannot modify itself!"));
        const changeRequest = await this.findChangeRequest(request.userId,request.changeRequestId);
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
            const changeNewUserRequestUsecase = new ChangeNewUserRequestUsecase(this.workflowDetailsRepository);
            //update previous task status to REVERTED
            const revertedChangeRequest = await changeNewUserRequestUsecase.revertPreviousChangeRequestTask(lastChangeRequestTask,loggedInUser,request.comments);
            await this.workflowTaskRepository.insert(revertedChangeRequest);

            //add new task assigning to users in previous workflow process
            const previousWorkflowProcess = await this.findWorkflowProcess(lastChangeRequestTask.workflowGroupId,lastChangeRequestTask.workflowId,currentworkflowProcess?.previousItem);
            const newChangeRequestTask = await this.addRequestorChangeRequest(lastChangeRequestTask,previousWorkflowProcess);
            await this.workflowTaskRepository.insert(newChangeRequestTask);

            //update role change request to status Request for change
            const userChangeRequest = await this.updateChangeRequestStatus(changeRequest,userAsLabelValue,previousWorkflowProcess);
            userChangeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.getByStatus(userChangeRequest.status);

            await this.userChangeRequestRepository.update(userChangeRequest);

            const response = new ChangeNewUserRequestUsecaseResponse(request.changeRequestId,request.userId);
            return Result.createSuccessWithMessage(response, "Change Request Sent.");
        }
    }
    protected async findChangeRequest(refId: string, changeRequestId: string): Promise<UserChangeRequest> {
        return await this.userChangeRequestRepository.findChangeRequestByRefIdAndRequestId(refId,changeRequestId);
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