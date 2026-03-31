import { DatasourceService } from "@app/core/db/datasource.service";
import { Page } from "@app/core/repository/search/page";
import { PageableInfo } from "@app/core/repository/search/pageable.info";
import { SearchMeta } from "@app/core/repository/search/search.meta";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { GeneralPolicy } from "../../entities/general-policy.entity";
import { GeneralPolicyRepository } from "../general-policy.repository";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "@app/core/middleware/request_context";

@Injectable()
export class GeneralPolicyDbRepository implements GeneralPolicyRepository {
	constructor (
		private dataSourceService: DatasourceService,
		private readonly als: AsyncLocalStorage<RequestContext>
	) { }

	repository: Repository<GeneralPolicy>;

	private getClientCode(strict = true) {
		const clientCode = this.als.getStore()?.getCurrentUser()?.clientCode;
		if (!clientCode && strict) {
			throw new UnauthorizedException("Missing client context");
		}
		return clientCode;
	}
	private async setRepository() {
		this.repository = await this.dataSourceService.getRepository(GeneralPolicy);
	}

	async insert(entity: GeneralPolicy): Promise<GeneralPolicy> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		entity.clientCode = clientCode;
		const addedGeneralPolicy = await this.repository.insert(entity);
		return addedGeneralPolicy.raw[0];
	}
	async update(entity: Partial<GeneralPolicy>): Promise<GeneralPolicy> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		const updatedGeneralPolicy = await this.repository.update(
			{ id: entity.id, clientCode },
			entity
		);
		return updatedGeneralPolicy.raw[0];
	}
	delete(entity: GeneralPolicy): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async findById(id: string): Promise<GeneralPolicy> {
		await this.setRepository();
		const clientCode = this.getClientCode(false);
		const criteria: any = { id };
		if (clientCode) {
			criteria.clientCode = clientCode;
		}
		const generalPolicy = await this.repository.findOneBy(criteria);
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
		const clientCode = this.getClientCode(false);
		const generalPolicy = clientCode
			? await this.repository.findBy({ clientCode })
			: await this.repository.find();
		return generalPolicy;
	}
	findTotalCount(): Promise<number> {
		throw new Error("Method not implemented.");
	}
}
