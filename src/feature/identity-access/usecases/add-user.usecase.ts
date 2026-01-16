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
import { SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";
import { ForbiddenException, Inject, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { UserChangeRequest } from "../entities/user-change-request.entity";
import { UserByRole } from "../entities/user.entity";
import { BankBranchesRepository } from "../repositories/bank-branches.repository";
import { BankBranchesDbRepository } from "../repositories/db/bank-branches.repository";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { UserRepository } from "../repositories/user.repository";
import { AddUserUsecaseRequest } from "./requests/add-user.usecase.request";
import { AddUserUsecaseResponse } from "./response/add-user.usecase.response";
import { WorkflowActor } from "CMS-BACK-END/src/shared/constants/workflow-actors.constant";
import { User } from "../entities/user.entity";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { WorkflowTaskMaker } from "CMS-BACK-END/src/shared/usecase/workflow-task-maker";

export class AddUserUsecase extends WorkflowTaskMaker<UserChangeRequest,AddUserUsecaseRequest> implements Usecase<AddUserUsecaseRequest, AddUserUsecaseResponse>{
	constructor(
		@Inject(UserDbRepository) private readonly userRepository?: UserRepository,
		@Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
		@Inject(UserChangeRequestDbRepository) private readonly userChangeRequestRepository?: UserChangeRequestRepository,
		@Inject(BankBranchesDbRepository) private readonly bankBranchesRepository?: BankBranchesRepository,
		@Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
		@Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository
	) {super()}
	async execute(request: AddUserUsecaseRequest, requestContext?: RequestContext): Promise<Result<AddUserUsecaseResponse>> {
		const loggedInUser = requestContext.getCurrentUser().loginId;
		const firstWorkflowProcess = await this.findFirstWorkflowProcess();
		const user = await this.userRepository.findById(loggedInUser);
        const isPermission = await this.checkPermission(firstWorkflowProcess, user);
		if(!isPermission){
            return Result.createError(new ForbiddenException("You do not have permission to create!"));
        }
		await this.validateUserAttributeExists(request);
		const secondWorkflowProcess = await this.findSecondWorkflowProcess(firstWorkflowProcess);
		const changeRequest = await this.prepareChangedData(request,loggedInUser,secondWorkflowProcess);
		const workflowGrpStatus = (await this.workflowDetailsRepository.findById(WorkflowGroupType.ICW.name))?.active;
		const addUserUsecase = new AddUserUsecase(this.userRepository, this.workflowDetailsRepository);
		//saving requestor task 
		const workflowRequestorTask = await this.prepareRequestorTaskData(
			changeRequest.id,WorkflowGroupType.ICW.name,WorkflowGroupType.ICW.name,loggedInUser,firstWorkflowProcess,workflowGrpStatus
		);
		await this.workflowTaskRepository.insert(workflowRequestorTask);
		//saving task and assigned to reviewer
		const secondWorkflowTsk = await this.prepareSecondChangeRequestTaskData(workflowRequestorTask,secondWorkflowProcess);
		await this.workflowTaskRepository.insert(secondWorkflowTsk);
		//finally saving change request to users change request table
		await this.userChangeRequestRepository.insert(changeRequest);
		const response = new AddUserUsecaseResponse();
		return Result.createSuccessWithMessage(response,"User creation in progress");
	}
	protected async prepareChangedData(request: AddUserUsecaseRequest, loggedInUser: string,nextWorkflowProcess: WorkflowDetail): Promise<UserChangeRequest> {
		const userChangeRequest = new UserChangeRequest();
		userChangeRequest.id = IdGenerator.generateId("4");
		userChangeRequest.refId = IdGenerator.generateId("4");
		userChangeRequest.userName = request.userName;
		userChangeRequest.userId = request.userId;
		userChangeRequest.employeeId = request.employeeId;
		const bankBranch = await this.bankBranchesRepository.findById(request.branch);
		if (!bankBranch) {
			Result.createErrorWithMessage(new NotFoundException(),"Cannot find branch");
		}
		const branch = new SelectMenu(bankBranch.name,bankBranch.id);
		userChangeRequest.branch = branch;
		let rolesList: SelectMenu[] = [];
		for (let i = 0; i < request.roles.length; i++) {
			const role = await this.rolesRepository.findById(request.roles[i]);
			if (!role) {
				Result.createError(new NotFoundException("Cannot find roles"));
			}
			const rolesMenu = new SelectMenu(role.title,role.id);
			rolesList.push(rolesMenu);
		}
		userChangeRequest.roles = rolesList;
		userChangeRequest.type = ChangeRequestType.ADD.name;
		userChangeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.IN_PROGRESS.name;
		const todayDate = DateUtils.getCurrentFullDate();
		userChangeRequest.requestedOn = DateUtils.convertToString(todayDate);
		const user = await this.userRepository.findById(loggedInUser);
		userChangeRequest.requestedBy =  new LabelValuePair(user.userName, loggedInUser);
		if(nextWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name){
            userChangeRequest.nextActor = WorkflowActor.REVIEWER.name;
			userChangeRequest.status = ChangeRequestStatus.IN_REVIEW.name;
        }
        if(nextWorkflowProcess?.data.type === WorkflowActor.APPROVER.name){
            userChangeRequest.nextActor = WorkflowActor.APPROVER.name;
			userChangeRequest.status = ChangeRequestStatus.IN_APPROVAL.name;
        }
		userChangeRequest.active = request.active;
		return userChangeRequest;
	}
	protected async findFirstWorkflowProcess(): Promise<WorkflowDetail> {
		const workflowDetails: WorkflowDetail[] = await this.workflowDetailsRepository.findAllWorkflowDetails(WorkflowGroupType.ICW.name,WorkflowGroupType.ICW.name);
        const firstWorkflowProcess = workflowDetails?.find((process)=> !process.previousItem);
        return firstWorkflowProcess;
	}
	protected async findSecondWorkflowProcess(firstWorkflowProcess: WorkflowDetail): Promise<WorkflowDetail> {		
		return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(
            WorkflowGroupType.ICW.name,WorkflowGroupType.ICW.name, firstWorkflowProcess.nextItem
        );
	}
	protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
		
		return await this.userRepository.findUsersByRoleId(role);
	}
	private async validateUserAttributeExists(request:AddUserUsecaseRequest):Promise<boolean>{
		let userIdExists: User | UserChangeRequest, employeeIdExists: User | UserChangeRequest;
		userIdExists = await this.userRepository.findActiveUserID(request.userId);
		if(userIdExists){
			Result.createErrorWithMessage(new NotAcceptableException(`User ID: ${request.userId} already exists`), "Duplicate User ID1");
		}
		userIdExists = await this.userChangeRequestRepository.findByUserId(request.userId);
		if(userIdExists){
			Result.createErrorWithMessage(new NotAcceptableException(`User ID: ${request.userId} already exists`), "Duplicate User ID2");
		}
		employeeIdExists = await this.userRepository.findByEmployeeId(request.employeeId);
		if(employeeIdExists){
			Result.createErrorWithMessage(new NotAcceptableException(`Employee ID: ${request.employeeId} already exists`), "Duplicate Employee ID");
		}
		employeeIdExists = await this.userChangeRequestRepository.findByEmployeeId(request.employeeId);
		if(employeeIdExists){
			Result.createErrorWithMessage(new NotAcceptableException(`Employee ID: ${request.employeeId} already exists`), "Duplicate Employee ID");
		}
		return false;
	}
}