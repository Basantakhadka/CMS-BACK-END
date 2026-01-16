import { Injectable, OnModuleInit } from "@nestjs/common";
import redisStore from "cache-manager-redis-store";

@Injectable()
export class CacheFactory implements OnModuleInit {
	private static instance: CacheFactory;
	private caches: Record<string, Cache>;

	constructor() {
		if (!CacheFactory.instance) {
			this.caches = {};
			CacheFactory.instance = this;
		}
		return CacheFactory.instance;
	}

	async onModuleInit() {
		// Initialize the default cache on module init
		await this.getOrCreateCache("getpay");
	}

	private async createCache(name: string): Promise<Cache> {
		const redisConfig = {
			host: process.env.REDIS_HOST || "localhost",
			port: process.env.REDIS_PORT || "6379",
			password: process.env.REDIS_PASSWORD || "",
		};

		const store = redisStore.create(redisConfig);
		this.caches[name] = store;
		return store;
	}

	async getOrCreateCache(name: string = "getpay"): Promise<any> {
		if (!this.caches[name]) {
			return this.createCache(name);
		}
		return this.caches[name];
	}

	async cacheData(
		key: string,
		data: any,
		config?: { ttl?: number; max?: number }
	): Promise<void> {
		const redisCache = await this.getOrCreateCache();
		const ttl =  config?.ttl;

		await redisCache.set(key, data, {ttl});
	}

	async getCachedData<T>(key: string): Promise<T | undefined> {
		const redisCache = await this.getOrCreateCache();
		return redisCache.get(key);
	}

	async deleteCachedData(key: string): Promise<void> {
		try {
			const redisCache = await this.getOrCreateCache();
			await redisCache.del(key);
		} catch (err) {
			console.log(`Error while delete redis key value ${err}`);
		}
	}

	async reset(): Promise<void> {
		const redisCache = await this.getOrCreateCache();
		await redisCache.reset();
	}
}