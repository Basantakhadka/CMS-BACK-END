import { DatasourceService } from "@app/core/db/datasource.service";
import { RequestContext } from "@app/core/middleware/request_context";
import { Page } from "@app/core/repository/search/page";
import { PageableInfo } from "@app/core/repository/search/pageable.info";
import { SearchMeta } from "@app/core/repository/search/search.meta";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { Repository } from "typeorm";
import { UserCredential } from "../../entities/user-credential.entity";
import { UserCredentialRepository } from "../user-credential.repository";

@Injectable()
export class UserCredentialDbRepository implements UserCredentialRepository {
	constructor (
		private readonly als: AsyncLocalStorage<RequestContext>,
		private dataSourceService: DatasourceService
	) { }

	private getSchema() {
		return this.als?.getStore()["currentUser"].schema;
	}

	private repository: Repository<UserCredential>;

	private getClientCode(strict = true) {
		const clientCode = this.als.getStore()?.getCurrentUser()?.clientCode;
		if (!clientCode && strict) {
			throw new UnauthorizedException("Missing client context");
		}
		return clientCode;
	}

	private async setRepository(schema?: string) {
		this.repository = await this.dataSourceService.getRepository(
			UserCredential,
			schema,
		);
	}
	async insert(entity: UserCredential): Promise<UserCredential> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		entity.clientCode = clientCode;
		return (await this.repository.insert(entity)).raw[0];
	}
	async update(entity: Partial<UserCredential>): Promise<UserCredential> {
		await this.setRepository();
		const clientCode = entity.clientCode || this.getClientCode();
		const user = await this.repository.update({ id: entity.id, clientCode }, entity);
		return user.raw[0];
	}
	delete(entity: UserCredential): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async findById(id: string): Promise<UserCredential> {
		await this.setRepository();
		const clientCode = this.getClientCode(false);
		const criteria: any = { id };
		if (clientCode) {
			criteria.clientCode = clientCode;
		}
		const user = await this.repository.findOneBy(criteria);
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
	async findUserByIdWithKeyspace(id: string, schema: string, clientCode?: string) {
		await this.setRepository(schema);
		const criteria: any = { id };
		if (clientCode) {
			criteria.clientCode = clientCode;
		}
		const user = await this.repository.findOneBy(criteria);
		return user;
	}
}
