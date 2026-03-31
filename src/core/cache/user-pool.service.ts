import { CacheFactory } from "@app/core/cache/cache.factory";
import {
	Injectable,
	OnModuleInit,
	UnauthorizedException,
} from "@nestjs/common";
import * as cacheManager from "cache-manager";

const DEFAULT_TTL = 36;

interface UserLoginCache {
	userLoginId: string;
	sessionId: string;
	clientCode: string;

	lastLoginDateTime?: Date;

	lastRequestDateTime?: Date;

	sessionExpiresOn?: Date;
}

const addMilliseconds = (date: Date | string, milliseconds: number) => {
	const result = new Date(date);
	result.setMilliseconds(result.getMilliseconds() + milliseconds);
	return result;
};

export const toKey = (userId: string, clientCode: string) =>
	`${ userId?.toLowerCase() }-${ clientCode?.toLowerCase() }`;

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

	getUser(userId: string, clientCode: string): Promise<UserLoginCache> {
		return this.cacheServiceFactory.getCachedData(
			toKey(userId,clientCode)
		);
	}

	getAllActiveUsers() {
		// return this.userLoginCache.keys();
	}

	revokeSession(userId: string,clientCode: string) {
		if (userId) {
			this.cacheServiceFactory.deleteCachedData(toKey(userId,clientCode));
		}
	}
	deleteSession(key:string){
		this.cacheServiceFactory.deleteCachedData(key);
	}

	async isUserSessionActive(
		userId: string,
		clientCode: string

	): Promise<boolean> {
		const user = await this.getUser(userId, clientCode);
		return !!user;
	}

	async validateSession(
		userId: string,
		clientCode: string,
		sessionId: string
	) {
		const user = await this.getUser(userId, clientCode);
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
			toKey(userLoginCache.userLoginId, userLoginCache.clientCode),
			cache,
			{ ttl: this.CACHE_CONFIG.ttl }
		);
	}

	async refreshSession(userId: string, clientCode: string) {
		let now = new Date();
		const user = await this.getUser(userId, clientCode);
		let sessionExpiresOn = addMilliseconds(
			user.sessionExpiresOn,
			this.CACHE_CONFIG.ttl
		);

		let cache: UserLoginCache = {
			...user,
			sessionExpiresOn,
			lastRequestDateTime: now,
		};

		await this.cacheServiceFactory.cacheData(toKey(userId, clientCode), cache, {
			ttl: this.CACHE_CONFIG.ttl,
		});
	}
}
