import { CacheFactory } from '@app/core/cache/cache.factory';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { DataSource } from 'typeorm';


const DEFAULT_TTL = 100;
interface MCCDataDto {
    label: string;
    value: string;
    title: string;
}

@Injectable()
export class MccCacheService implements OnModuleInit, OnModuleDestroy {
    protected CACHE_NAME = 'Mcc_CACHE';
    protected CACHE_CONFIG: { ttl: number; max: number };
    private readonly logger = new Logger(MccCacheService.name);

    constructor(private cacheServiceFactory: CacheFactory, @InjectDataSource() private dataSource: DataSource) {}

    async loadMccData() {
        const mccData: MCCDataDto[] = await this.dataSource.query(`
			SELECT
				mcc.title as label,
				mcc.code as value,
				CONCAT(mcc.title, '-', mcc.code) as title
			FROM
				shared.lookup_data AS mcc
			WHERE
				type = 'MCC'
			GROUP BY
				mcc.title, mcc.code;
		`);
        await this.storeMccDetails(mccData);
        return mccData;
    }

    async onModuleInit() {
        await this.loadMccData();
    }

    async onModuleDestroy() {
        await this.cacheServiceFactory.deleteCachedData(this.CACHE_NAME);
    }

    async storeMccDetails(mccData: any) {
        await this.cacheServiceFactory.cacheData(this.CACHE_NAME, mccData);
    }

    async getMccDetails(): Promise<MCCDataDto[]> {
        const cachedData = await this.cacheServiceFactory.getCachedData<MCCDataDto[]>(this.CACHE_NAME);

        if (cachedData && cachedData.length > 0) {
            return cachedData;
        }
        const mccData = await this.loadMccData();
        return mccData;
    }
}
