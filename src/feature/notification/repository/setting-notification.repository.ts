import { BaseRepository } from "@app/core/repository/base.repository";
import { SettingsNotificationsByType } from "../entities/setting-notification.entity";

export interface SettingsNotificationRepository
	extends BaseRepository<SettingsNotificationsByType, string> {
	getMessageConfigDetailsByType(
		type: string,
		code: string
	): Promise<SettingsNotificationsByType>;
}