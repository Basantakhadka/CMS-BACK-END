import { UserPoolService } from "CMS-BACK-END/src/core/cache/user-pool.service";
import { hashPassword } from "CMS-BACK-END/src/core/hashing/hashing";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { SystemConfigurationDbRepository } from "@app/feature/system-configuration/repositories/db/system-configuration.repository";
import { SystemConfigurationRepository } from "@app/feature/system-configuration/repositories/system-configuration.repository";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowTasksRepository } from "@app/feature/workflow/repository/workflow-tasks.repository";
import { TaskStatus } from "CMS-BACK-END/src/shared/constants/change-request-detail-task-status.constant";
import { ChangeRequestOutcomeStatus } from "CMS-BACK-END/src/shared/constants/change-request-outcome-status.constants";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { WorkflowTask } from "@app/shared/entities/workflow-task.entity";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";
import { IMailOptions } from "CMS-BACK-END/src/shared/mailer/mailer-interfaces";
import { WorkflowTaskApprover } from "CMS-BACK-END/src/shared/usecase/workflow-task-approve";
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import path from "path";
import { UserChangeRequest } from "../entities/user-change-request.entity";
import { User, UserByRole } from "../entities/user.entity";
import { IamMessageProducer } from "../producers/iam-message.producer";
import { BankBranchesRepository } from "../repositories/bank-branches.repository";
import { BankBranchesDbRepository } from "../repositories/db/bank-branches.repository";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { UserCredentialDbRepository } from "../repositories/db/user-credential.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { UserCredentialRepository } from "../repositories/user-credential.repository";
import { UserRepository } from "../repositories/user.repository";
import { ApproveNewUserChangeRequestUsecaseRequest } from "./requests/new-user-approve-change-request.usecase.request";
import { ApproveNewUserChangeRequestUsecaseResponse } from "./response/new-user-approve-change-request.usecase.response";
import { UserCredential } from "../entities/user-credential.entity";
import { ExportEmailConfigEnvDto } from "CMS-BACK-END/src/shared/dtos/export-email-config-env.dto";
import { parseJsonFromString } from "CMS-BACK-END/src/shared/utils/json-parser-utils";
import { EmailService } from "CMS-BACK-END/src/core/notification/notification.service";
@Injectable()
export class ApproveNewUserChangeRequestUsecase
	extends WorkflowTaskApprover<
		UserChangeRequest,
		ApproveNewUserChangeRequestUsecaseRequest
	>
	implements
		Usecase<
			ApproveNewUserChangeRequestUsecaseRequest,
			ApproveNewUserChangeRequestUsecaseResponse
		>
{
	constructor(
		@Inject(WorkflowGroupDbRepository)
		public workflowDetailsRepository?: WorkflowGroupRepository,
		@Inject(UserDbRepository) private readonly userRepository?: UserRepository,
		@Inject(WorkflowTasksDbRepository)
		private readonly workflowTaskRepository?: WorkflowTasksRepository,
		@Inject(UserChangeRequestDbRepository)
		private readonly userChangeRequestRepository?: UserChangeRequestRepository,
		@Inject(BankBranchesDbRepository)
		private readonly bankBranchesRepository?: BankBranchesRepository,
		@Inject(RolesDbRepository)
		private readonly rolesRepository?: RolesRepository,
		@Inject(UserCredentialDbRepository)
		private userCredentialRepository?: UserCredentialRepository,
		@Inject(SystemConfigurationDbRepository)
		private readonly systemConfigurationRepository?: SystemConfigurationRepository,
		private als?: AsyncLocalStorage<RequestContext>,
		@Inject(IamMessageProducer)
		private readonly iamMessageProducer?: IamMessageProducer,
		@Inject(UserPoolService) private userPoolService?: UserPoolService,
		@Inject(EmailService) private emailService?: EmailService
	) {
		super();
	}
	async execute(
		request: ApproveNewUserChangeRequestUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<ApproveNewUserChangeRequestUsecaseResponse>> {
		const loggedInUser = requestContext.getCurrentUser().loginId;
		if (loggedInUser === request.userId)
			Result.createError(new ForbiddenException("User cannot modify itself!"));
		const changeRequest = await this.findChangeRequest(
			request.userId,
			request.changeRequestId
		);
		if (!changeRequest)
			Result.createError(
				new NotFoundException(
					`Change request with Id '${request.changeRequestId}' not found!`
				)
			);
		if (changeRequest?.requestedBy?.value === loggedInUser) {
			Result.createError(
				new BadRequestException("User cannot approve own change request!")
			);
		}
		if (
			changeRequest.changeRequestStatus !==
			ChangeRequestOutcomeStatus.IN_PROGRESS.name
		)
			Result.createError(
				new BadRequestException(
					`Request already ${changeRequest.status.toLocaleLowerCase()}`
				)
			);
		const lastChangeRequestTask = await this.findLastChangeRequestTask(
			request.changeRequestId
		);
		if (!lastChangeRequestTask)
			Result.createErrorWithMessage(
				new NotFoundException(),
				"Change request task Not Found!"
			);

		const user = await this.userRepository.findById(loggedInUser);
		const userAsLabelValue = new LabelValuePair(user.userName, loggedInUser);
		const currentworkflowProcess: WorkflowDetail =
			await this.findWorkflowProcess(
				lastChangeRequestTask.workflowGroupId,
				lastChangeRequestTask.workflowId,
				lastChangeRequestTask.stepId
			);
		await this.checkPermission(currentworkflowProcess, user);
		if (changeRequest.status === ChangeRequestStatus.APPROVED.name)
			Result.createErrorWithMessage(
				new BadRequestException(),
				"Request already approved!"
			);

		const prevWorkflowTask =
			await this.workflowTaskRepository.findTaskByIdAndStepCounter(
				lastChangeRequestTask.requestId,
				lastChangeRequestTask.stepCounter - 1
			);
		if (
			currentworkflowProcess?.previousItem &&
			prevWorkflowTask.taskStatus === TaskStatus.REVERTED.name
		)
			Result.createErrorWithMessage(
				new BadRequestException(),
				"Cannot approve this change request!"
			);

		const approveNewUserChangeRequestUsecase =
			new ApproveNewUserChangeRequestUsecase(this.workflowDetailsRepository);
		//update prev request task status to complete
		const updatedPrevTask = await this.completePreviousChangeRequestTask(
			lastChangeRequestTask,
			loggedInUser
		);
		await this.workflowTaskRepository.update(updatedPrevTask);

		//checking if current workflow process is approver
		if (!currentworkflowProcess?.nextItem) {
			const updatedChangeRequest =
				await this.setChangeRequestStatusToApprovedIfApprovedByMainApprover(
					changeRequest,
					userAsLabelValue
				);
			updatedChangeRequest.changeRequestStatus =
				ChangeRequestOutcomeStatus.COMPLETE.name;
			await this.userChangeRequestRepository.update(updatedChangeRequest);
			//create/ modify new user after approved by main approver
			if (changeRequest.type === ChangeRequestType.DELETE.name) {
				await this.handleUserDeleteRequest(changeRequest, requestContext);
			} else if (changeRequest.type === ChangeRequestType.UPDATE.name) {
				await this.handleUpdateUserRequest(changeRequest, requestContext);
			} else if (changeRequest.type === ChangeRequestType.ADD.name) {
				await this.handleAddUserRequest(changeRequest, requestContext);
			}
		} else {
			const nextworkflowProcess: WorkflowDetail =
				await this.findWorkflowProcess(
					lastChangeRequestTask.workflowGroupId,
					lastChangeRequestTask.workflowId,
					currentworkflowProcess.nextItem
				);
			//insert new task
			const newTask = await this.addChangeRequestTaskAccordingToWorkflow(
				lastChangeRequestTask,
				nextworkflowProcess
			);
			await this.workflowTaskRepository.insert(newTask);

			//update user change request to approval pending
			const updatedRoleChangeRequest = await this.updateChangeRequestStatus(
				changeRequest,
				userAsLabelValue,
				nextworkflowProcess
			);
			updatedRoleChangeRequest.changeRequestStatus =
				ChangeRequestOutcomeStatus.getByStatus(updatedRoleChangeRequest.status);
			await this.userChangeRequestRepository.update(updatedRoleChangeRequest);
		}
		const response = new ApproveNewUserChangeRequestUsecaseResponse(
			request.changeRequestId
		);
		return Result.createSuccess(response);
	}
	protected async findChangeRequest(
		refId: string,
		changeRequestId: string
	): Promise<UserChangeRequest> {
		return await this.userChangeRequestRepository.findChangeRequestByRefIdAndRequestId(
			refId,
			changeRequestId
		);
	}
	protected async findLastChangeRequestTask(
		requestId: string
	): Promise<WorkflowTask> {
		return await this.workflowTaskRepository.findlatestChangeRequestTask(
			requestId
		);
	}
	protected async findWorkflowProcess(
		workflowGrp: string,
		workflowType: string,
		processId: string
	): Promise<WorkflowDetail> {
		return await this.workflowDetailsRepository.findWorkflowByGroupIdWorkflowIdAndProcessId(
			workflowGrp,
			workflowType,
			processId
		);
	}
	protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
		return await this.userRepository.findUsersByRoleId(role);
	}
	private async handleAddUserRequest(
		changeRequest: UserChangeRequest,
		requestContext: RequestContext
	) {
		const user = new User();
		user.id = changeRequest.refId;
		user.branch = changeRequest.branch;
		user.employeeId = changeRequest.employeeId;
		user.roles = changeRequest.roles;
		user.userId = changeRequest.userId;
		user.userName = changeRequest.userName;
		user.createdBy = changeRequest.requestedBy;
		user.createdOn = changeRequest.requestedOn;
		user.deleted = false;
		user.active = changeRequest.active;
		await this.userRepository.insert(user);
		user.roles.forEach(async (role) => {
			const userByRole = new UserByRole();
			userByRole.roleId = role.value;
			userByRole.userId = user.id;
			await this.userRepository.insertUserByRole(userByRole);
		});
		await this.addUserCredential(
			user,
			requestContext.getCurrentUser().institutionCode
		);
	}
	private async handleUpdateUserRequest(
		changeRequest: UserChangeRequest,
		requestContext: RequestContext
	) {
		const savedUser = await this.userRepository.findById(changeRequest.refId);
		savedUser.roles.forEach(
			async (item) =>
				await this.userRepository.deleteUsersByRole(item.value, savedUser.id)
		);
		const user = new User();
		user.id = changeRequest.refId;
		user.createdOn = savedUser.createdOn;
		user.branch = changeRequest.branch;
		user.employeeId = changeRequest.employeeId;
		user.roles = changeRequest.roles;
		user.userId = changeRequest.userId;
		user.userName = changeRequest.userName;
		user.lastModifiedBy = changeRequest.requestedBy;
		user.lastModifiedOn = changeRequest.requestedOn;
		user.active = changeRequest.active;
		await this.userRepository.update(user);
		user.roles.forEach(async (role) => {
			const userByRole = new UserByRole();
			userByRole.roleId = role.value;
			userByRole.userId = user.id;
			await this.userRepository.insertUserByRole(userByRole);
		});
		// if user role has changed then revoke session
		const userRoles = savedUser.roles;
		const userRoleIds = userRoles.map((role) => role.value);
		const changeRequestRoles = changeRequest.roles.map((role) => role.value);
		if (userRoleIds.length !== changeRequestRoles.length) {
			return await this.handleUserSignoutAfterDelete(
				changeRequest,
				requestContext
			);
		}
		const isRoleChanged = changeRequestRoles.some(
			(role) => !userRoleIds.includes(role)
		);
		if (isRoleChanged) {
			await this.handleUserSignoutAfterDelete(changeRequest, requestContext);
		}
	}
	private async handleUserDeleteRequest(
		changeRequest: UserChangeRequest,
		requestContext: RequestContext
	) {
		const savedUser = await this.userRepository.findById(changeRequest.refId);
		savedUser.deleted = true;
		savedUser.deletedBy = changeRequest.requestedBy;
		savedUser.deletedOn = changeRequest.requestedOn;
		await this.userRepository.update(savedUser);
		savedUser.roles.forEach(
			async (item) =>
				await this.userRepository.deleteUsersByRole(item.value, savedUser.id)
		);
		await this.handleUserSignoutAfterDelete(changeRequest, requestContext);
	}
	private async handleUserSignoutAfterDelete(
		changeRequest: UserChangeRequest,
		requestContext: RequestContext
	) {
		const userCredentials = await this.userCredentialRepository.findById(
			changeRequest.refId
		);
		const newCredentials = new UserCredential();
		newCredentials.id = userCredentials.id;
		newCredentials.version = IdGenerator.generateId();
		await this.userCredentialRepository.update(newCredentials);
		this.userPoolService.revokeSession(
			changeRequest?.userId,
			requestContext.getCurrentUser().institutionCode
		);
	}
	private async addUserCredential(user: User, memberCode: string) {
		const randomPassword: string = this.generatePassword();
		const password = await hashPassword(randomPassword, user.id, user.userId);
		await this.userCredentialRepository.insert({
			id: user.id,
			version: IdGenerator.generateId("4"),
			passwordHistory: [],
			blocked: false,
			expiryTime: null,
			loginAttemptsTimer: null,
			unsuccessfulLoginAttempts: null,
			password,
			enforcePasswordChange: true,
		});
		const operatorsInfo = await this.systemConfigurationRepository.findAll();
		const operatorInfo = operatorsInfo[0];
		const configKey = JSON.parse(operatorInfo?.configKey);
		const operatorName = configKey?.institutionName;
		const operatorLargeLogo = configKey?.institutionLargeLogo;

		const mailOptions = this.prepareMailOptions(
			operatorName,
			operatorLargeLogo,
			randomPassword,
			user,
			memberCode
		);

		await this.sendEmail(mailOptions);
	}

	private prepareMailOptions(
		operatorName: string,
		operatorLargeLogo: string,
		password: string,
		user: User,
		memberCode: string
	): IMailOptions {
		let exportEmailConfig: ExportEmailConfigEnvDto;
		if (
			process.env.EMAIL_CONFIG === null ||
			process.env.EMAIL_CONFIG === undefined
		) {
			exportEmailConfig = {
				poweredByLogoPath: "",
				showPoweredBy: false,
				merchantOnboardPoweredByLogoPath: "",
			};
		} else {
			exportEmailConfig = parseJsonFromString<ExportEmailConfigEnvDto>(
				process.env.EMAIL_CONFIG
			);
		}

		const operatorPortalLink = process.env.INSTITUTION_PORTAL_LINK;
		const showPoweredByLogo = exportEmailConfig.showPoweredBy;
		const poweredByLogoPath = exportEmailConfig.poweredByLogoPath;

		const attachments = [
			{
				fileName: "getpay",
				path: poweredByLogoPath
					? path.resolve(__dirname, poweredByLogoPath)
					: "",
				cid: "getpay",
			},
		];

		const replaceValues = {
			name: user.userName,
			username: user.userId,
			password: password,
			institutionLargeLogo: operatorLargeLogo,
			portalLink: operatorPortalLink,
			institutionName: operatorName,
			memberCode: memberCode,
			showPoweredByLogo: showPoweredByLogo,
		};

		const mailOptions: IMailOptions = {
			subject: `Welcome to ${operatorName}: Your Account Information`,
			to: user.userId,
			templateName: "new-user-email",
			replace: replaceValues,
			attachments,
		};

		return mailOptions;
	}

	private async sendEmail(emailProperties: IMailOptions) {
		await this.emailService.sendEmail({
			emailProperties,
		});
	}
	private generatePassword(): string {
		const length = 8;
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let password = "";

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * chars.length);
			password += chars[randomIndex];
		}

		return password;
	}
}
