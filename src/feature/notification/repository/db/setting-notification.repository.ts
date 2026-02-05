import { DatasourceService } from "@app/core/db/datasource.service";
import { Page } from "@app/core/repository/search/page";
import { PageableInfo } from "@app/core/repository/search/pageable.info";
import { SearchMeta } from "@app/core/repository/search/search.meta";
import { InstitutionCodePrefixType } from "@app/shared/constants/institution-code-prefix.constant";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { SettingsNotificationsByType } from "../../entities/setting-notification.entity";
import { SettingsNotificationRepository } from "../setting-notification.repository";
import { SystemsConstant } from "@app/core/constants/systems.constant";

@Injectable()
export class SettingsNotificationDbRepository
	implements SettingsNotificationRepository
{
	constructor(private dataSourceService: DatasourceService) {}

	private repository: Repository<SettingsNotificationsByType>;

	private getSchema() {
		return SystemsConstant.SHARED_KEYSPACE;
	}
	private async setRepository() {
		this.repository = await this.dataSourceService.getRepository(
			SettingsNotificationsByType,
			this.getSchema()
		);
	}

	async getMessageConfigDetailsByType(
		type: string,
		code: string
	): Promise<SettingsNotificationsByType> {
		await this.setRepository();
		const messageConfig = await this.repository.findOneBy({
			type: type,
			code: code,
		});
		return messageConfig;
	}
	insert(
		entity: SettingsNotificationsByType
	): Promise<SettingsNotificationsByType> {
		throw new Error("Method not implemented.");
	}
	update(
		entity: Partial<SettingsNotificationsByType>
	): Promise<SettingsNotificationsByType> {
		throw new Error("Method not implemented.");
	}
	delete(entity: SettingsNotificationsByType): Promise<void> {
		throw new Error("Method not implemented.");
	}
	findById(id: string): Promise<SettingsNotificationsByType> {
		throw new Error("Method not implemented.");
	}
	findAllWithFilters(
		filters: SearchMeta
	): Promise<SettingsNotificationsByType[]> {
		throw new Error("Method not implemented.");
	}
	findTotalCountWithFilters(filters: SearchMeta): Promise<number> {
		throw new Error("Method not implemented.");
	}
	findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo
	): Promise<Page<SettingsNotificationsByType>> {
		throw new Error("Method not implemented.");
	}
	findAll(): Promise<SettingsNotificationsByType[]> {
		throw new Error("Method not implemented.");
	}
	findTotalCount(): Promise<number> {
		throw new Error("Method not implemented.");
	}
}
