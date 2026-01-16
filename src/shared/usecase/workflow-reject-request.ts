import { Result } from "@app/feature/common/result";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { WorkflowTask } from "../entities/workflow-task.entity";
import { TaskType } from "../constants/change-request-detail-task-type.constant";
import { TaskStatus } from "../constants/change-request-detail-task-status.constant";
import { DateUtils } from "../date-utils";
import { ChangeRequestStatus } from "../constants/change-request-status.constant";
import { ChangeRequest } from "../entities/change-request";
import { LabelValuePair } from "../entities/label-value-pair.view";
import { User } from "CMS-BACK-END/src/feature/identity-access/entities/user.entity";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowAssignTo } from "../constants/workflow-assign-to.constant";

export abstract class RejectRequest<E extends ChangeRequest>{
    protected abstract findChangeRequest(refId:string, changeRequestId:string):Promise<E>;
    protected abstract findLastChangeRequestTask(requestId:string):Promise<WorkflowTask>;
    protected async checkPermission(workflowProcess:WorkflowDetail,user:User):Promise<void>{
        const role = workflowProcess.data.role.value;
        let isPermission = false;
        if(workflowProcess.data.assignedTo === WorkflowAssignTo.ALL.name){
            for(let i=0; i<user.roles.length; i++){
                if(user.roles[i].value === role){
                    isPermission = true;
                }
            }
        }
        if(workflowProcess.data.assignedTo === WorkflowAssignTo.SPECIFIC.name){
            const users = workflowProcess.data.specificUsers;
            for(let i=0; i<users.length; i++){
                if(users[i].value === user.id){
                    isPermission = true;
                }
            }
        }
        if(!isPermission){
            Result.createErrorWithMessage(new ForbiddenException("User does not have permission!"),"User does not have permission!");
        }
    }
    protected async revertPreviousChangeRequestTask(lastChangeRequestTask: WorkflowTask,loggedInUser:string):Promise<WorkflowTask>{
        lastChangeRequestTask.taskStatus = TaskStatus.COMPLETED.name;
        lastChangeRequestTask.taskClosedOn = DateUtils.convertToString(DateUtils.getCurrentFullDate());
        lastChangeRequestTask.taskClosedBy = loggedInUser;
        return lastChangeRequestTask;
    }
    protected async addNewTaskLogAsRejected(lastChangeRequestTask:WorkflowTask, loggedInUser:string, comments:string):Promise<WorkflowTask>{
        const task = new WorkflowTask();
        task.requestId = lastChangeRequestTask.requestId;
        task.stepCounter = lastChangeRequestTask.stepCounter + 1;
        task.workflowGroupId = lastChangeRequestTask.workflowGroupId;
        task.workflowId = lastChangeRequestTask.workflowId;
        task.taskStatus = TaskStatus.COMPLETED.name;
        task.taskType = TaskType.REJECT.name;
        task.taskClosedOn = DateUtils.convertToString(DateUtils.getCurrentFullDate());
        task.taskComments = comments;
        task.taskClosedBy = loggedInUser;
        return task;
    }
    protected async rejectChangeRequest(changeRequest: E,loggedInUser:LabelValuePair,comments:string):Promise<E>{
        changeRequest.status = ChangeRequestStatus.REJECTED.name;
        changeRequest.verifiedOn = DateUtils.convertToString(DateUtils.getCurrentFullDate());
        changeRequest.verifiedBy = loggedInUser;
        changeRequest.denialReason = comments;
        return changeRequest;
    }
}