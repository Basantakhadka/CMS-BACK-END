import { CacheFactory } from "CMS-BACK-END/src/core/cache/cache.factory";
import {
	Injectable,
	OnModuleInit,
	UnauthorizedException,
} from "@nestjs/common";
import * as cacheManager from "cache-manager";

const DEFAULT_TTL = 36;

interface UserLoginCache {
	userLoginId: string;

	institutionCode: string;

	sessionId: string;

	lastLoginDateTime?: Date;

	lastRequestDateTime?: Date;

	sessionExpiresOn?: Date;
}

const addMilliseconds = (date: Date | string, milliseconds: number) => {
	const result = new Date(date);
	result.setMilliseconds(result.getMilliseconds() + milliseconds);
	return result;
};

export const toKey = (userId: string, institutionCode: string) =>
	`${userId?.toLowerCase()}-${institutionCode?.toLowerCase()}`;

@Injectable()
export class UserPoolService implements OnModuleInit {
	protected CACHE_NAME: string = "USER_LOGIN_CACHE";
	protected CACHE_CONFIG: { ttl?: number; max?: number };

	async onModuleInit() {
		this.CACHE_CONFIG = {
			ttl: +process.env.JWT_EXPIRES_IN,
		};
	}

	constructor(private cacheServiceFactory: CacheFactory) {}

	getUser(userId: string, institutionCode: string): Promise<UserLoginCache> {
		return this.cacheServiceFactory.getCachedData(
			toKey(userId, institutionCode)
		);
	}

	getAllActiveUsers() {
		// return this.userLoginCache.keys();
	}

	revokeSession(userId: string, institutionCode: string) {
		if (userId) {
			this.cacheServiceFactory.deleteCachedData(toKey(userId, institutionCode));
		}
	}
	deleteSession(key:string){
		this.cacheServiceFactory.deleteCachedData(key);
	}

	async isUserSessionActive(
		userId: string,
		institutionCode: string
	): Promise<boolean> {
		const user = await this.getUser(userId, institutionCode);
		return !!user;
	}

	async validateSession(
		userId: string,
		institutionCode: string,
		sessionId: string
	) {
		const user = await this.getUser(userId, institutionCode);
		if (!sessionId || !user || user.sessionId !== sessionId) {
			throw new UnauthorizedException();
		}
	}

	cacheUserLogin(userLoginCache: UserLoginCache) {
		let now = new Date();
		let sessionExpiresOn = addMilliseconds(now, this.CACHE_CONFIG.ttl);
		let cache: UserLoginCache = {
			...userLoginCache,
			lastLoginDateTime: now,
			sessionExpiresOn,
		};
		this.cacheServiceFactory.cacheData(
			toKey(userLoginCache.userLoginId, userLoginCache.institutionCode),
			cache,
			{ ttl: this.CACHE_CONFIG.ttl }
		);
	}

	async refreshSession(userId: string, institutionCode: string) {
		let now = new Date();
		const user = await this.getUser(userId, institutionCode);
		let sessionExpiresOn = addMilliseconds(
			user.sessionExpiresOn,
			this.CACHE_CONFIG.ttl
		);

		let cache: UserLoginCache = {
			...user,
			sessionExpiresOn,
			lastRequestDateTime: now,
		};

		await this.cacheServiceFactory.cacheData(toKey(userId, institutionCode), cache, {
			ttl: this.CACHE_CONFIG.ttl,
		});
	}
}
