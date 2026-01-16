import { Global, Module } from "@nestjs/common";
import { CacheFactory } from "./cache.factory";
import { UserPoolService } from "./user-pool.service";
import { BankDetailsCacheService } from "./bank-details.service";
import { MccCacheService } from "./mcc-cache.service";

@Global()
@Module({
	providers: [
		CacheFactory,
		UserPoolService,
		BankDetailsCacheService,
		MccCacheService,
	],
	exports: [
		CacheFactory,
		UserPoolService,
		BankDetailsCacheService,
		MccCacheService,
	],
})
export class CacheModule {}
