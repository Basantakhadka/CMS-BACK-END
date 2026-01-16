import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Page } from "CMS-BACK-END/src/core/repository/search/page";
import { PageableInfo } from "CMS-BACK-END/src/core/repository/search/pageable.info";
import { SearchMeta } from "CMS-BACK-END/src/core/repository/search/search.meta";
import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { Repository } from "typeorm";
import { UserCredential } from "../../entities/user-credential.entity";
import { UserCredentialRepository } from "../user-credential.repository";
import { InstitutionCodePrefixType } from "CMS-BACK-END/src/shared/constants/institution-code-prefix.constant";

@Injectable()
export class UserCredentialDbRepository implements UserCredentialRepository {
	constructor(
		private readonly als: AsyncLocalStorage<RequestContext>,
		private dataSourceService: DatasourceService
	) {}

	private getSchema() {
		return this.als?.getStore()["currentUser"].schema;
	}

	private repository: Repository<UserCredential>;

	private async setRepository(schema?: string) {
		this.repository = await this.dataSourceService.getRepository(
			UserCredential,
			schema
		);
	}
	async insert(entity: UserCredential): Promise<UserCredential> {
		await this.setRepository();
		return (await this.repository.insert(entity)).raw[0];
	}
	async update(entity: Partial<UserCredential>): Promise<UserCredential> {
		await this.setRepository();
		const user = await this.repository.update({ id: entity.id }, entity);
		return user.raw[0];
	}
	delete(entity: UserCredential): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async findById(id: string): Promise<UserCredential> {
		await this.setRepository();
		const user = await this.repository.findOneBy({ id });
		return user;
	}
	findAllWithFilters(filters: SearchMeta): Promise<UserCredential[]> {
		throw new Error("Method not implemented.");
	}
	findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
		throw new Error("Method not implemented.");
	}
	findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo
	): Promise<Page<UserCredential>> {
		throw new Error("Method not implemented.");
	}
	findAll(): Promise<UserCredential[]> {
		throw new Error("Method not implemented.");
	}
	findTotalCount(): Promise<number> {
		throw new Error("Method not implemented.");
	}
	async findUserByIdWithKeyspace(id: string, schema: string) {
		await this.setRepository(schema);
		const user = await this.repository.findOneBy({ id });
		return user;
	}
}
