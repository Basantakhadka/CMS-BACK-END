import {
	User,
	UserByRole,
} from "CMS-BACK-END/src/feature/identity-access/entities/user.entity";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { TaskStatus } from "../constants/change-request-detail-task-status.constant";
import { TaskType } from "../constants/change-request-detail-task-type.constant";
import { DateUtils } from "../date-utils";
import { WorkflowAssignTo } from "../constants/workflow-assign-to.constant";
import { WorkflowActor } from "../constants/workflow-actors.constant";
import { WorkflowTask } from "../entities/workflow-task.entity";
import { TaskAssignedToType } from "@app/feature/service-fees/entities/msf-change-request.entity";

export abstract class WorkflowTaskMaker<C, R> {
	protected abstract prepareChangedData(
		request: R,
		loggedInUser: string,
		nextWorkflowProcess: WorkflowDetail
	): Promise<C>;
	protected abstract findFirstWorkflowProcess(): Promise<WorkflowDetail>;
	protected abstract findSecondWorkflowProcess(
		firstWorkflowProcess: WorkflowDetail
	): Promise<WorkflowDetail>;
	protected abstract getUsersbyRole(role: string): Promise<UserByRole[]>;

	protected async checkPermission(
		firstWorkflowProcess: WorkflowDetail,
		user: User
	): Promise<boolean> {
		const role = firstWorkflowProcess.data.role.value;
		let isPermission = false;
		if (firstWorkflowProcess.data.assignedTo === WorkflowAssignTo.ALL.name) {
			for (let i = 0; i < user.roles.length; i++) {
				if (user.roles[i].value === role) {
					isPermission = true;
				}
			}
		}
		if (
			firstWorkflowProcess.data.assignedTo === WorkflowAssignTo.SPECIFIC.name
		) {
			const users = firstWorkflowProcess.data.specificUsers;
			for (let i = 0; i < users.length; i++) {
				if (users[i].value === user.id) {
					isPermission = true;
				}
			}
		}
		return isPermission;
	}
	protected async prepareRequestorTaskData(
		requestId: string,
		workflowGrp: string,
		workflowType: string,
		loggedInUser: string,
		firstWorkflowProcess: WorkflowDetail,
		workflowStatus: boolean
	): Promise<WorkflowTask> {
		const task = new WorkflowTask();
		task.requestId = requestId;
		task.stepCounter = 1;
		task.workflowGroupId = workflowGrp;
		task.workflowId = workflowType;
		task.taskType = TaskType.REQUEST.name;

		if (firstWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name) {
			task.taskType = TaskType.REVIEW.name;
		}
		if (firstWorkflowProcess?.data.type === WorkflowActor.MAKERS.name) {
			task.taskType = TaskType.MAKER.name;
		}
		if (!workflowStatus) {
			task.taskType = TaskType.VERIFY.name;
		}
		task.taskStatus = TaskStatus.COMPLETED.name;
		task.taskClosedOn = DateUtils.convertToString(
			DateUtils.getCurrentFullDate()
		);
		task.taskClosedBy = loggedInUser;
		task.taskAssignedOn = DateUtils.convertToString(
			DateUtils.getCurrentFullDate()
		);
		task.stepId = firstWorkflowProcess?.cardId;
		const taskAssignTo = new TaskAssignedToType();
		taskAssignTo.role = firstWorkflowProcess?.data.role;
		if (firstWorkflowProcess?.data.assignedTo === WorkflowAssignTo.ALL.name) {
			let userIdList: string[] = [];
			await this.getUsersbyRole(firstWorkflowProcess.data.role.value).then(
				(data) =>
					data.forEach((item) => {
						userIdList.push(item.userId);
					})
			);
			userIdList.filter((userId) => !firstWorkflowProcess?.data.excludeUsers);
			taskAssignTo.allowedUsers = { ALL: true, allowedUsers: userIdList };
			taskAssignTo.restrictUsers = firstWorkflowProcess.data.excludeUsers?.map(
				(item) => item.value
			);
			task.taskAssignedTo = JSON.stringify(taskAssignTo);
		}
		if (
			firstWorkflowProcess?.data.assignedTo === WorkflowAssignTo.SPECIFIC.name
		) {
			const specificUsers = firstWorkflowProcess.data.specificUsers?.map(
				(item) => item.value
			);
			taskAssignTo.allowedUsers = { ALL: false, allowedUsers: specificUsers };
			task.taskAssignedTo = JSON.stringify(taskAssignTo);
		}
		return task;
	}
	protected async prepareSecondChangeRequestTaskData(
		workflowTask: WorkflowTask,
		secondWorkflowProcess: WorkflowDetail
	): Promise<WorkflowTask> {
		const task = new WorkflowTask();
		task.requestId = workflowTask.requestId;
		task.stepCounter = 1;
		task.workflowGroupId = workflowTask.workflowGroupId;
		task.workflowId = workflowTask.workflowId;
		task.stepCounter = 2;
		task.taskStatus = TaskStatus.ASSIGNED.name;
		task.taskAssignedOn = DateUtils.convertToString(
			DateUtils.getCurrentFullDate()
		);
		const taskAssignTo = new TaskAssignedToType();
		taskAssignTo.role = secondWorkflowProcess?.data.role;

		if (secondWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name) {
			task.taskType = TaskType.REVIEW.name;
		}
		if (secondWorkflowProcess?.data.type === WorkflowActor.EDITOR.name) {
			task.taskType = TaskType.EDIT.name;
		}
		if (secondWorkflowProcess?.data.type === WorkflowActor.APPROVER.name) {
			task.taskType = TaskType.VERIFY.name;
		}
		if (secondWorkflowProcess?.data.assignedTo === WorkflowAssignTo.ALL.name) {
			let userIdList: string[] = [];
			await this.getUsersbyRole(secondWorkflowProcess?.data.role.value).then(
				(data) =>
					data.forEach((item) => {
						userIdList.push(item.userId);
					})
			);
			taskAssignTo.allowedUsers = { ALL: true, allowedUsers: userIdList };
			taskAssignTo.restrictUsers =
				secondWorkflowProcess?.data.excludeUsers?.map((item) => item.value);
			task.taskAssignedTo = JSON.stringify(taskAssignTo);
		}
		if (
			secondWorkflowProcess?.data.assignedTo === WorkflowAssignTo.SPECIFIC.name
		) {
			const specificUsers = secondWorkflowProcess?.data.specificUsers?.map(
				(item) => item.value
			);
			taskAssignTo.allowedUsers = { ALL: false, allowedUsers: specificUsers };
			task.taskAssignedTo = JSON.stringify(taskAssignTo);
		}
		task.stepId = secondWorkflowProcess?.cardId;
		return task;
	}
}
