import {
	User,
	UserByRole,
} from "CMS-BACK-END/src/feature/identity-access/entities/user.entity";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { TaskStatus } from "../constants/change-request-detail-task-status.constant";
import { TaskType } from "../constants/change-request-detail-task-type.constant";
import { ChangeRequestStatus } from "../constants/change-request-status.constant";
import { DateUtils } from "../date-utils";
import { WorkflowActor } from "../constants/workflow-actors.constant";
import { WorkflowAssignTo } from "../constants/workflow-assign-to.constant";
import { ChangeRequest } from "../entities/change-request";
import { LabelValuePair } from "../entities/label-value-pair.view";
import { Result } from "@app/feature/common/result";
import { ForbiddenException } from "@nestjs/common";
import { WorkflowTask } from "../entities/workflow-task.entity";
import { TaskAssignedToType } from "@app/feature/service-fees/entities/msf-change-request.entity";

export abstract class WorkflowTaskChangeRequest<E extends ChangeRequest> {
	protected abstract findChangeRequest(
		refId: string,
		changeRequestId: string
	): Promise<E>;
	protected abstract findLastChangeRequestTask(
		requestId: string
	): Promise<WorkflowTask>;
	protected abstract findWorkflowProcess(
		workflowGrp: string,
		workflowType: string,
		processId: string
	): Promise<WorkflowDetail>;
	protected abstract getUsersbyRole(role: string): Promise<UserByRole[]>;
	protected async checkPermission(
		workflowProcess: WorkflowDetail,
		user: User
	): Promise<void> {
		const role: string = workflowProcess.data.role.value;
		let isPermission = false;
		if (workflowProcess.data.assignedTo === WorkflowAssignTo.ALL.name) {
			for (let i = 0; i < user.roles.length; i++) {
				if (user.roles[i].value === role) {
					isPermission = true;
				}
			}
		}
		if (workflowProcess.data.assignedTo === WorkflowAssignTo.SPECIFIC.name) {
			const users = workflowProcess.data.specificUsers;
			for (let i = 0; i < users.length; i++) {
				if (users[i].value === user.id) {
					isPermission = true;
				}
			}
		}
		if (!isPermission) {
			Result.createErrorWithMessage(
				new ForbiddenException("User does not have permission!"),
				"User does not have permission!"
			);
		}
	}
	protected async revertPreviousChangeRequestTask(
		lastChangeRequestTask: WorkflowTask,
		loggedInUser: string,
		comments: string
	): Promise<WorkflowTask> {
		lastChangeRequestTask.taskStatus = TaskStatus.REVERTED.name;
		lastChangeRequestTask.taskClosedOn = DateUtils.convertToString(
			DateUtils.getCurrentFullDate()
		);
		lastChangeRequestTask.taskClosedBy = loggedInUser;
		lastChangeRequestTask.taskComments = comments;
		return lastChangeRequestTask;
	}
	protected async addRequestorChangeRequest(
		lastChangeRequestTask: WorkflowTask,
		previousWorkflowProcess?: WorkflowDetail
	): Promise<WorkflowTask> {
		const task = new WorkflowTask();
		task.requestId = lastChangeRequestTask.requestId;
		task.stepCounter = lastChangeRequestTask.stepCounter + 1;
		task.workflowGroupId = lastChangeRequestTask.workflowGroupId;
		task.workflowId = lastChangeRequestTask.workflowId;
		task.taskStatus = TaskStatus.ASSIGNED.name;
		task.taskAssignedOn = DateUtils.convertToString(
			DateUtils.getCurrentFullDate()
		);
		if (previousWorkflowProcess) {
			if (!previousWorkflowProcess?.previousItem) {
				task.taskType = TaskType.MAKER.name;
			}
			if (previousWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name) {
				task.taskType = TaskType.REVIEW.name;
			}
			if (previousWorkflowProcess?.data.type === WorkflowActor.EDITOR.name) {
				task.taskType = TaskType.EDIT.name;
			}
			const taskAssignTo = new TaskAssignedToType();
			taskAssignTo.role = previousWorkflowProcess?.data.role;
			if (
				previousWorkflowProcess?.data.assignedTo === WorkflowAssignTo.ALL.name
			) {
				let userIdList: string[] = [];
				await this.getUsersbyRole(
					previousWorkflowProcess?.data.role.value
				).then((data) =>
					data.forEach((item) => {
						userIdList.push(item.userId);
					})
				);
				taskAssignTo.allowedUsers = { ALL: true, allowedUsers: userIdList };
				taskAssignTo.restrictUsers =
					previousWorkflowProcess?.data.excludeUsers?.map((item) => item.value);
				task.taskAssignedTo = JSON.stringify(taskAssignTo);
			}
			if (
				previousWorkflowProcess?.data.assignedTo ===
				WorkflowAssignTo.SPECIFIC.name
			) {
				const specificUsers = previousWorkflowProcess?.data.specificUsers?.map(
					(item) => item.value
				);
				taskAssignTo.allowedUsers = { ALL: false, allowedUsers: specificUsers };
				task.taskAssignedTo = JSON.stringify(taskAssignTo);
			}
			task.stepId = previousWorkflowProcess.cardId;
		} else {
			task.taskType = TaskType.MAKER.name;
		}
		return task;
	}
	protected async updateChangeRequestStatus(
		changeRequest: E,
		loggedInUser: LabelValuePair,
		previousWorkflowProcess?: WorkflowDetail
	): Promise<E> {
		changeRequest.status = ChangeRequestStatus.REQUEST_FOR_CHANGE.name;
		if (previousWorkflowProcess) {
			if (previousWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name) {
				changeRequest.nextActor = WorkflowActor.REVIEWER.name;
			}
			if (previousWorkflowProcess?.data.type === WorkflowActor.EDITOR.name) {
				changeRequest.nextActor = WorkflowActor.EDITOR.name;
			}
			if (previousWorkflowProcess?.data.type === WorkflowActor.MAKERS.name) {
				changeRequest.nextActor = WorkflowActor.MAKERS.name;
			}
		} else {
			changeRequest.nextActor = WorkflowActor.MAKERS.name;
		}
		changeRequest.verifiedOn = DateUtils.convertToString(
			DateUtils.getCurrentFullDate()
		);
		changeRequest.verifiedBy = loggedInUser;
		return changeRequest;
	}
}
