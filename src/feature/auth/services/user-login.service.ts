import { JwtStrategy } from "@app/core/auth/JwtStrategy";
import { CacheFactory } from "@app/core/cache/cache.factory";
import { UserPoolService } from "@app/core/cache/user-pool.service";
import { RequestContext } from "@app/core/middleware/request_context";
import { Result } from "@app/feature/common/result";
import { UserCredential } from "@app/feature/identity-access/entities/user-credential.entity";
import {
	User,
	UserByRole,
} from "@app/feature/identity-access/entities/user.entity";
import { GeneralPolicyDbRepository } from "@app/feature/identity-access/repositories/db/general-policy.repository";
import { RolesDbRepository } from "@app/feature/identity-access/repositories/db/roles.repository";
import { UserCredentialDbRepository } from "@app/feature/identity-access/repositories/db/user-credential.repository";
import { UserDbRepository } from "@app/feature/identity-access/repositories/db/user.repository";
import { GeneralPolicyRepository } from "@app/feature/identity-access/repositories/general-policy.repository";
import { RolesRepository } from "@app/feature/identity-access/repositories/roles.repository";
import { UserCredentialRepository } from "@app/feature/identity-access/repositories/user-credential.repository";
import { UserRepository } from "@app/feature/identity-access/repositories/user.repository";
import { LabelValuePair } from "@app/shared/entities/label-value-pair.view";
import { IdGenerator } from "@app/shared/id-generator";
import { Inject, NotFoundException } from "@nestjs/common";
import { JwtSignOptions } from "@nestjs/jwt";
import { AsyncLocalStorage } from "async_hooks";
import { Cache } from "cache-manager";

export class UserLoginService {
	protected CACHE_NAME: string;
	protected CACHE_CONFIG: { ttl: number; max: number };
	loginCache: Cache;
	constructor (
		private cacheServiceFactory: CacheFactory,
		@Inject(UserCredentialDbRepository)
		private userCredentialRepository: UserCredentialRepository,
		@Inject(UserDbRepository) private userRepository: UserRepository,
		@Inject(RolesDbRepository) private rolesRepository: RolesRepository,
		@Inject(GeneralPolicyDbRepository)
		private readonly generalPolicyRepository: GeneralPolicyRepository,
		private readonly als: AsyncLocalStorage<RequestContext>,
		private readonly jwtStrategy: JwtStrategy,
		@Inject(UserPoolService)
		private userLoginCacheService: UserPoolService
	) { }

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


		const sessionId = IdGenerator.generateId("v4");

		const payload = {
			userId: user.userId,
			fullName: user.userName,
			username: user.userId,
			roles: JSON.stringify(
				user.roles.map((rolesPair: LabelValuePair) => rolesPair.value)
			),
			version: userCredential.version,
			schema: requestContext.getCurrentUser().schema,
			enforcePasswordChange,
			MFAStatus,
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
	protected async getUsersbyRole(role: string): Promise<UserByRole[]> {
		return await this.userRepository.findUsersByRoleId(role);
	}
}
