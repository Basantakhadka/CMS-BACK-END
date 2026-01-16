import { JwtStrategy } from "CMS-BACK-END/src/core/auth/JwtStrategy";
import { CacheFactory } from "CMS-BACK-END/src/core/cache/cache.factory";
import { UserPoolService } from "CMS-BACK-END/src/core/cache/user-pool.service";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Result } from "@app/feature/common/result";
import { UserCredential } from "CMS-BACK-END/src/feature/identity-access/entities/user-credential.entity";
import {
	User,
	UserByRole,
} from "CMS-BACK-END/src/feature/identity-access/entities/user.entity";
import { GeneralPolicyDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/general-policy.repository";
import { RolesDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/roles.repository";
import { UserCredentialDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user-credential.repository";
import { UserDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user.repository";
import { GeneralPolicyRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/general-policy.repository";
import { RolesRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/roles.repository";
import { UserCredentialRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/user-credential.repository";
import { UserRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/user.repository";
import { SystemConfigurationDbRepository } from "@app/feature/system-configuration/repositories/db/system-configuration.repository";
import { SystemConfigurationRepository } from "@app/feature/system-configuration/repositories/system-configuration.repository";
import { WorkflowDetail } from "@app/feature/workflow/entities/workflow-details.entity";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowGroupRepository } from "@app/feature/workflow/repository/workflow-group.repository";
import { WorkflowAssignTo } from "CMS-BACK-END/src/shared/constants/workflow-assign-to.constant";
import {
	WorkflowGroupType,
	WorkflowType,
} from "CMS-BACK-END/src/shared/constants/workflow-group.constant";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";
import { imageUrlToBase64 } from "CMS-BACK-END/src/shared/utils/base64-utils";
import { Inject, NotFoundException } from "@nestjs/common";
import { JwtSignOptions } from "@nestjs/jwt";
import { AsyncLocalStorage } from "async_hooks";
import { Cache } from "cache-manager";

export class UserLoginService {
	protected CACHE_NAME: string;
	protected CACHE_CONFIG: { ttl: number; max: number };
	loginCache: Cache;
	constructor(
		private cacheServiceFactory: CacheFactory,
		@Inject(UserCredentialDbRepository)
		private userCredentialRepository: UserCredentialRepository,
		@Inject(UserDbRepository) private userRepository: UserRepository,
		@Inject(RolesDbRepository) private rolesRepository: RolesRepository,
		@Inject(GeneralPolicyDbRepository)
		private readonly generalPolicyRepository: GeneralPolicyRepository,
		private readonly als: AsyncLocalStorage<RequestContext>,
		private readonly jwtStrategy: JwtStrategy,
		@Inject(SystemConfigurationDbRepository)
		private readonly systemConfigurationRepository: SystemConfigurationRepository,
		@Inject(WorkflowGroupDbRepository)
		public workflowDetailsRepository: WorkflowGroupRepository,
		@Inject(UserPoolService)
		private userLoginCacheService: UserPoolService
	) {}

	async execute(
		user: User,
		userCredential: UserCredential,
		requestContext: RequestContext,
		enforcePasswordChange: boolean,
		MFAStatus: string
	) {
		let permissions: string[] = [];
		const userRoles = [];
		await Promise.all(
			user.roles.map(async (role: { label: string; value: string }) => {
				const rolesData = await this.rolesRepository.findById(role.value);
				userRoles.push(role.label);
				permissions.push(...rolesData.permissions);
			})
		);
		permissions = Array.from(new Set(permissions));
		const isPerm = await this.checkIsMakerPermission(user.id);
		if (isPerm) {
			permissions.push("merchants:newApplications");
		}

		const systemConfigurations =
			await this.systemConfigurationRepository.findAll();
		if (!systemConfigurations?.length) {
			Result.createError(
				new NotFoundException("System configuration not found")
			);
		}
		const configKey =
			systemConfigurations[0]?.configKey &&
			JSON.parse(systemConfigurations[0].configKey);
		if (!configKey) {
			Result.createError(
				new NotFoundException("Config key not found in system configuration")
			);
		}

		const sessionId = IdGenerator.generateId("v4");

		const payload = {
			userId: user.userId,
			fullName: user.userName,
			username: user.userId,
			roles: JSON.stringify(
				user.roles.map((rolesPair: LabelValuePair) => rolesPair.value)
			),
			version: userCredential.version,
			institutionCode: requestContext.getCurrentUser().institutionCode,
			schema: requestContext.getCurrentUser().schema,
			enforcePasswordChange,
			MFAStatus,
			institutionType: configKey.institutionType,
			sessionId,
		};

		const jwtId = IdGenerator.generateId("v4");

		const jwtSignOption: JwtSignOptions = {
			subject: user.id,
			jwtid: jwtId,
		};
		const accessToken = this.jwtStrategy.sign(payload, jwtSignOption);
		if (!enforcePasswordChange) {
			this.userLoginCacheService.cacheUserLogin({
				institutionCode: requestContext.getCurrentUser().institutionCode,
				userLoginId: user.userId,
				sessionId,
			});
		}

		const loginResponse = {
			profile: { fullName: user.userName, roles: userRoles },
			permissions: !enforcePasswordChange ? permissions : [],
			accessToken,
			enforcePasswordChange,
			mfaStatus: MFAStatus,
			institutionType: configKey.institutionType,
			jti: jwtId,
			institutionName: configKey?.institutionName,
		};

		await this.cacheServiceFactory.cacheData(jwtId, accessToken, {
			ttl: +process.env.JWT_EXPIRES_IN,
		});

		return loginResponse;
	}

	async storeMccDetails(mccData: any) {
		if (!this.loginCache) {
			throw new Error("Cache not initialized");
		}
		await this.loginCache.set(this.CACHE_NAME, mccData, this.CACHE_CONFIG.ttl);
	}

	async getMccDetails(): Promise<
		{
			label: string;
			value: string;
			title: string;
		}[]
	> {
		if (!this.loginCache) {
			throw new Error("Cache not initialized");
		}
		return await this.loginCache.get(this.CACHE_NAME);
	}
	protected async checkIsMakerPermission(userId: string): Promise<boolean> {
		const firstWorkflowProcess = await this.findFirstWorkflowProcess();
		if (firstWorkflowProcess?.data.assignedTo === WorkflowAssignTo.ALL.name) {
			let userIdList: string[] = [];
			const data = await this.getUsersbyRole(
				firstWorkflowProcess.data.role.value
			);
			data.forEach((item) => userIdList.push(item.userId));
			userIdList.filter((userId) => !firstWorkflowProcess?.data.excludeUsers);
			return userIdList.includes(userId);
		}
		if (
			firstWorkflowProcess?.data.assignedTo === WorkflowAssignTo.SPECIFIC.name
		) {
			const specificUsers = firstWorkflowProcess.data.specificUsers?.map(
				(item) => item.value
			);
			return specificUsers.includes(userId);
		}
	}
	protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
		return await this.userRepository.findUsersByRoleId(role);
	}
	protected async findFirstWorkflowProcess(): Promise<WorkflowDetail> {
		const workflowDetails: WorkflowDetail[] =
			await this.workflowDetailsRepository.findAllWorkflowDetails(
				WorkflowGroupType.ONB.name,
				WorkflowType.BACKOFFICE.name
			);
		const firstWorkflowProcess = workflowDetails?.find(
			(process) => !process.previousItem
		);
		return firstWorkflowProcess;
	}
}
