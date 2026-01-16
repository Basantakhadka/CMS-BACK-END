import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { Page } from "CMS-BACK-END/src/core/repository/search/page";
import { PageableInfo } from "CMS-BACK-END/src/core/repository/search/pageable.info";
import { SearchMeta } from "CMS-BACK-END/src/core/repository/search/search.meta";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { BankBranch } from "../../entities/bank-branch.entity";
import { BankBranchesRepository } from "../bank-branches.repository";

@Injectable()
export class BankBranchesDbRepository implements BankBranchesRepository {
	constructor(private readonly dataSourceService: DatasourceService) {}
	repository: Repository<BankBranch>;
	private async setRepository() {
		this.repository = await this.dataSourceService.getRepository(BankBranch);
	}
	insert(entity: BankBranch): Promise<BankBranch> {
		throw new Error("Method not implemented.");
	}
	update(entity: Partial<BankBranch>): Promise<BankBranch> {
		throw new Error("Method not implemented.");
	}
	delete(entity: BankBranch): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async findById(id: string): Promise<BankBranch> {
		await this.setRepository();
		const bankBranch = await this.repository.findOneBy({
			id,
		});
		return bankBranch;
	}
	findAllWithFilters(filters: SearchMeta): Promise<BankBranch[]> {
		throw new Error("Method not implemented.");
	}
	findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
		throw new Error("Method not implemented.");
	}
	findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo
	): Promise<Page<BankBranch>> {
		throw new Error("Method not implemented.");
	}
	async findAll(): Promise<BankBranch[]> {
		await this.setRepository();
		const bankBranches = await this.repository.find();
		return bankBranches;
	}
	findTotalCount(): Promise<number> {
		throw new Error("Method not implemented.");
	}
}
