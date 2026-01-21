import { Global, Module } from "@nestjs/common";
import { CacheFactory } from "./cache.factory";
import { UserPoolService } from "./user-pool.service";

@Global()
@Module({
	providers: [
		CacheFactory,
		UserPoolService,

	],
	exports: [
		CacheFactory,
		UserPoolService,
	]

})
export class CacheModule {}
