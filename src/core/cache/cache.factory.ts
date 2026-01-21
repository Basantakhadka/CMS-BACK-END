import { Injectable, OnModuleInit } from '@nestjs/common';

interface CacheItem {
	value: any;
	expiresAt?: number;
}

@Injectable()
export class CacheFactory implements OnModuleInit {
	private static instance: CacheFactory;
	private caches: Record<string, Map<string, CacheItem>>;

	constructor () {
		if (!CacheFactory.instance) {
			this.caches = {};
			CacheFactory.instance = this;
		}
		return CacheFactory.instance;
	}

	async onModuleInit() {
		// Initialize default cache
		await this.getOrCreateCache('default');
	}

	private async createCache(name: string): Promise<Map<string, CacheItem>> {
		const store = new Map<string, CacheItem>();
		this.caches[name] = store;
		return store;
	}

	async getOrCreateCache(name: string = 'default'): Promise<Map<string, CacheItem>> {
		if (!this.caches[name]) {
			return this.createCache(name);
		}
		return this.caches[name];
	}

	async cacheData(
		key: string,
		data: any,
		config?: { ttl?: number } // ttl in seconds
	): Promise<void> {
		const cache = await this.getOrCreateCache();
		const expiresAt = config?.ttl ? Date.now() + config.ttl * 1000 : undefined;
		cache.set(key, { value: data, expiresAt });
	}

	async getCachedData<T>(key: string): Promise<T | undefined> {
		const cache = await this.getOrCreateCache();
		const item = cache.get(key);

		if (!item) return undefined;

		// Check TTL
		if (item.expiresAt && item.expiresAt < Date.now()) {
			cache.delete(key);
			return undefined;
		}

		return item.value as T;
	}

	async deleteCachedData(key: string): Promise<void> {
		const cache = await this.getOrCreateCache();
		cache.delete(key);
	}

	async reset(): Promise<void> {
		const cache = await this.getOrCreateCache();
		cache.clear();
	}
}
