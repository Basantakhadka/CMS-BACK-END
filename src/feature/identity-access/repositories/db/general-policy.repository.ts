
import { DatasourceService } from "../../../../core/db/datasource.service";
import { Page } from "../../../../core/repository/search/page";
import { PageableInfo } from "../../../../core/repository/search/pageable.info";
import { SearchMeta } from "../../../../core/repository/search/search.meta";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { GeneralPolicy } from "../../entities/general-policy.entity";
import { GeneralPolicyRepository } from "../general-policy.repository";

@Injectable()
export class GeneralPolicyDbRepository implements GeneralPolicyRepository {
	constructor(private dataSourceService: DatasourceService) {}

	repository: Repository<GeneralPolicy>;
	private async setRepository() {
		this.repository = await this.dataSourceService.getRepository(GeneralPolicy);
	}

	async insert(entity: GeneralPolicy): Promise<GeneralPolicy> {
		await this.setRepository();
		const addedGeneralPolicy = await this.repository.insert(entity);
		return addedGeneralPolicy.raw[0];
	}
	async update(entity: Partial<GeneralPolicy>): Promise<GeneralPolicy> {
		await this.setRepository();
		const updatedGeneralPolicy = await this.repository.update(
			{ id: entity.id },
			entity
		);
		return updatedGeneralPolicy.raw[0];
	}
	delete(entity: GeneralPolicy): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async findById(id: string): Promise<GeneralPolicy> {
		await this.setRepository();
		const generalPolicy = await this.repository.findOneBy({
			id,
		});
		return generalPolicy;
	}
	findAllWithFilters(filters: SearchMeta): Promise<GeneralPolicy[]> {
		throw new Error("Method not implemented.");
	}
	findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
		throw new Error("Method not implemented.");
	}
	findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo
	): Promise<Page<GeneralPolicy>> {
		throw new Error("Method not implemented.");
	}
	async findAll(): Promise<GeneralPolicy[]> {
		await this.setRepository();
		const generalPolicy = await this.repository.find();
		return generalPolicy;
	}
	findTotalCount(): Promise<number> {
		throw new Error("Method not implemented.");
	}
}
