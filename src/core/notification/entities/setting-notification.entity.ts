import { SystemsConstant } from "CMS-BACK-END/src/core/constants/systems.constant";
import { DbEntity } from "CMS-BACK-END/src/core/repository/entity";
import {
	PrimaryTextColumn,
	TextColumn,
} from "CMS-BACK-END/src/shared/entities/entities.decorator";
import { Entity } from "typeorm";

@Entity({ name: "settings_notifications_by_type", schema: SystemsConstant.SHARED_KEYSPACE })
export class SettingsNotificationsByType implements DbEntity {
	@PrimaryTextColumn()
	type: string;

	@PrimaryTextColumn()
	code: string;

	@TextColumn()
	enforcedTemplate: string;

	@TextColumn()
	config: string;

	@TextColumn()
	remarks: string;

	getColumns?(): Map<string, string> {
		throw new Error("Method not implemented.");
	}
	getClusterColumns?(): string[] {
		throw new Error("Method not implemented.");
	}
}
