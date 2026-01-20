import { CacheFactory } from "@app/core/cache/cache.factory";
import {
	Injectable,
	OnModuleDestroy,
	OnModuleInit,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import * as cacheManager from "cache-manager";
import { DataSource } from "typeorm";

const DEFAULT_TTL = 10;

@Injectable()
export class BankDetailsCacheService implements OnModuleInit, OnModuleDestroy {
	protected CACHE_NAME = "BANK_DETAILS_CACHE";
	protected CACHE_CONFIG: any;

	constructor(
		private cacheServiceFactory: CacheFactory,
		@InjectDataSource() private dataSource: DataSource
	) {}

	async onModuleInit() {
		let bankData = await this.dataSource.query(`SELECT
    banks.title AS label,
    banks.code AS value,
    COALESCE(json_agg(json_build_object('label', branches.title, 'value', branches.code)), '[]') AS branch
FROM
    shared.lookup_data banks
LEFT JOIN
    shared.lookup_data branches ON banks.code = branches.parent_code
WHERE
    banks.type = 'BANK'
GROUP BY
    banks.title, banks.code;`);

		await this.storeBankDetails(bankData);
	}

	onModuleDestroy() {
		this.cacheServiceFactory.deleteCachedData(this.CACHE_NAME);
	}

	async storeBankDetails(bankDetails: any) {
		await this.cacheServiceFactory.cacheData(this.CACHE_NAME, bankDetails);
	}
	async getBankDetails() {
		return await this.cacheServiceFactory.getCachedData(this.CACHE_NAME);
	}
	// createa a function that  will return label value pair of banks only
	async getBanks() {
		let bankDetails: any = await this.getBankDetails();
		return bankDetails.map((bank) => {
			return {
				label: bank.label,
				value: bank.value,
			};
		});
	}
	//get all branches of a bank
	async getBranches(bankCode: string) {
		let bankDetails: any = await this.getBankDetails();

		let bank = bankDetails?.filter((b) => b.value == bankCode);

		return bank?.branch;
	}

	async findParticularBranchFromBank(bankCode: string) {
		let bankDetails: any = await this.getBankDetails();
		let bank = bankDetails.find((bank) => bank.value === bankCode);
		return bank?.branch;
	}
}
