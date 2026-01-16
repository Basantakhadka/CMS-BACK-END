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
import { BadRequestException, ForbiddenException, Inject, NotAcceptableException, NotFoundException } from "@nestjs/common";
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
import { UpdateUserUsecaseRequest } from "./requests/update-user.usecase.request";
import { UpdateUserUsecaseResponse } from "./response/update-user.usecase.response";
import { WorkflowActor } from "CMS-BACK-END/src/shared/constants/workflow-actors.constant";
import { User } from "../entities/user.entity";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { WorkflowTaskMaker } from "CMS-BACK-END/src/shared/usecase/workflow-task-maker";

export class UpdateUserUsecase extends WorkflowTaskMaker<UserChangeRequest,UpdateUserUsecaseRequest> implements Usecase<UpdateUserUsecaseRequest, UpdateUserUsecaseResponse>{
    constructor(
        @Inject(UserDbRepository) private readonly userRepository: UserRepository,
        @Inject(WorkflowGroupDbRepository) public workflowDetailsRepository?: WorkflowGroupRepository,
        @Inject(UserChangeRequestDbRepository) private readonly userChangeRequestRepository?: UserChangeRequestRepository,
        @Inject(BankBranchesDbRepository) private readonly bankBranchesRepository?: BankBranchesRepository,
        @Inject(RolesDbRepository) private readonly rolesRepository?: RolesRepository,
        @Inject(WorkflowTasksDbRepository) private readonly workflowTaskRepository?: WorkflowTasksRepository
    ){super()}
    async execute(request: UpdateUserUsecaseRequest, requestContext?: RequestContext): Promise<Result<UpdateUserUsecaseResponse>> {
            const loggedInUser = requestContext.getCurrentUser().loginId;
            const user = await this.userRepository.findById(loggedInUser);
            const firstWorkflowProcess = await this.findFirstWorkflowProcess();
        if (!firstWorkflowProcess) {
					Result.createError(
						new NotFoundException("Workflow process not found")
					);
				}
            const isPermission = await this.checkPermission(firstWorkflowProcess, user);
            if(!isPermission){
                return Result.createError(new ForbiddenException("You do not have permission to edit!"));
            }
            if(loggedInUser === request.id) Result.createError(new ForbiddenException("User cannot modify itself!"));
            await this.validateSavedUser(request.id);
            await this.validateUserAttributeExists(request);
            if(!(await this.validatePendingRequest(request.id))){
                Result.createError(new BadRequestException(`Change request is already in progress`));
            };
            const secondWorkflowProcess = await this.findSecondWorkflowProcess(firstWorkflowProcess);
            const changeRequest = await this.prepareChangedData(request,loggedInUser,secondWorkflowProcess);
			const workflowGrpStatus = (await this.workflowDetailsRepository.findById(WorkflowGroupType.IMW.name))?.active;
			const updateUserUsecase = new UpdateUserUsecase(this.userRepository, this.workflowDetailsRepository);
			
			//saving requestor task 
			const workflowRequestorTask = await this.prepareRequestorTaskData(
				changeRequest.id,WorkflowGroupType.IMW.name,WorkflowGroupType.IMW.name,loggedInUser,firstWorkflowProcess,workflowGrpStatus
			);
        	await this.workflowTaskRepository.insert(workflowRequestorTask);
			//saving task and assigned to reviewer
			const secondWorkflowTsk = await this.prepareSecondChangeRequestTaskData(workflowRequestorTask,secondWorkflowProcess);
       		await this.workflowTaskRepository.insert(secondWorkflowTsk);
			//finally saving change request to users change request table
			await this.userChangeRequestRepository.insert(changeRequest);
            
            const response = new UpdateUserUsecaseResponse(changeRequest.id, changeRequest.refId);
            return Result.createSuccessWithMessage(response, "Update operation requested.");
    }

    private async validateSavedUser(id:string){
        const savedUser = await this.userRepository.findById(id);
        if(!savedUser){
            Result.createError(new NotFoundException("User not found"));
        }
        if(savedUser.deleted === true){
            Result.createError(new NotFoundException("User already deleted"));
        }
        return savedUser;
    }
    private async validateUserAttributeExists(request: UpdateUserUsecaseRequest): Promise<boolean>{
        let userIdInUserExists: User, employeeIdInUserExists: User;
        userIdInUserExists = await this.userRepository.findByUserId(request.userId);
        if(userIdInUserExists && userIdInUserExists.id !== request.id){
            Result.createErrorWithMessage(new NotAcceptableException(`User ID: ${request.userId} already exists`), "Duplicate User ID");
        }
        let userIdInChangeRequestExists: UserChangeRequest, employeeIdInChangeRequestExists: UserChangeRequest;
        userIdInChangeRequestExists = await this.userChangeRequestRepository.findByUserId(request.userId);
        if(userIdInChangeRequestExists && userIdInChangeRequestExists.refId !== request.id){
            Result.createErrorWithMessage(new NotAcceptableException(`User ID: ${request.userId} already exists`), "Duplicate User ID");
        }
        employeeIdInUserExists = await this.userRepository.findByEmployeeId(request.employeeId);
        if(employeeIdInUserExists && employeeIdInUserExists.id !== request.id){
            Result.createErrorWithMessage(new NotAcceptableException(`Employee ID: ${request.employeeId} already exists`), "Duplicate Employee ID");
        }
        employeeIdInChangeRequestExists = await this.userChangeRequestRepository.findByEmployeeId(request.employeeId);
        if(employeeIdInChangeRequestExists && employeeIdInChangeRequestExists.refId !== request.id){
            Result.createErrorWithMessage(new NotAcceptableException(`Employee ID: ${request.employeeId} already exists`), "Duplicate Employee ID");
        }
        return false;
    }
    private async validatePendingRequest(id:string):Promise<boolean>{
        const savedUserChangeRequest = await this.userChangeRequestRepository.findCountByRefIdAndChangeRequestStatus(id, ChangeRequestOutcomeStatus.IN_PROGRESS.name);
        if(savedUserChangeRequest > 0){
            return false;
        }
        return true;
    }
    protected async prepareChangedData(request: UpdateUserUsecaseRequest, loggedInUser: string, nextWorkflowProcess:WorkflowDetail): Promise<UserChangeRequest> {
        const userChangeRequest = new UserChangeRequest();
        userChangeRequest.refId = request.id;
		userChangeRequest.id = IdGenerator.generateId();
        userChangeRequest.userName = request.userName;
        userChangeRequest.userId = request.userId;
        userChangeRequest.employeeId = request.employeeId;
        const bankBranch = await this.validateBankBranch(request.branch);
        userChangeRequest.branch = bankBranch;
        const rolesList = await this.validateRoles(request.roles);
        userChangeRequest.roles = rolesList;
		const user = await this.userRepository.findById(loggedInUser);
		userChangeRequest.requestedBy =  new LabelValuePair(user.userName, loggedInUser);
        const todayDate = DateUtils.getCurrentFullDate();
        userChangeRequest.requestedOn = DateUtils.convertToString(todayDate);
        userChangeRequest.type = ChangeRequestType.UPDATE.name;
        if(nextWorkflowProcess?.data.type === WorkflowActor.REVIEWER.name){
            userChangeRequest.nextActor = WorkflowActor.REVIEWER.name;
            userChangeRequest.status = ChangeRequestStatus.IN_REVIEW.name;
        }
        if(nextWorkflowProcess?.data.type === WorkflowActor.APPROVER.name){
            userChangeRequest.nextActor = WorkflowActor.APPROVER.name;
            userChangeRequest.status = ChangeRequestStatus.IN_APPROVAL.name;
        }
        userChangeRequest.changeRequestStatus = ChangeRequestOutcomeStatus.getByStatus(userChangeRequest.status);
        userChangeRequest.active = request.active;
		return userChangeRequest;
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

    private async validateBankBranch(branch:string): Promise<SelectMenu>{
        const bankBranch = await this.bankBranchesRepository.findById(branch);
        if(!bankBranch){
            throw new NotFoundException("Cannot find branch");
        }
        const newBranch = new SelectMenu(bankBranch.name,bankBranch.id);
        return newBranch;
    }

    private async validateRoles(roles:Array<string>): Promise<SelectMenu[]>{
        let rolesList:SelectMenu[] = [];
        for(let i =0; i < roles.length;i++){
            const savedRole = await this.rolesRepository.findById(roles[i]);
            if(!roles){
                throw new NotFoundException( `Cannot find roles`);
            }
            const rolesMenu = new SelectMenu(savedRole.title,savedRole.id);
            rolesList.push(rolesMenu);
        }
        return rolesList;
    }
    
}