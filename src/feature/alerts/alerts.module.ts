
import { Get, Module } from "@nestjs/common";
import { ContractAlertsController } from "./alert.controller";
import { GetContractAlertsListUsecase } from "./usecase/get-contract-list-alert.usecase";
import { DeleteContractAlertUsecase } from "./usecase/delete-contract-alert.usecase";
import { UpdateContractAlertUsecase } from "./usecase/update-contract-alert.usecase";
import { AddContractAlertUsecase } from "./usecase/add-contract-alert.usecase";
import { GetOneContractAlertUsecase } from "./usecase/get-one-contract-alert.usecase";
import { ContractAlertsDbRepository } from "./repositories/db/alerts.repository";
import { PermissionsCheckerService } from "../auth/services/permissions-checker.service";
import { UserDbRepository } from "../identity-access/repositories/db/user.repository";
import { RolesDbRepository } from "../identity-access/repositories/db/roles.repository";
import { ContractDbRepository } from "../contracts/repositories/db/contact.respository";
import { ContractExpiryCronUsecase } from "./usecase/contract-expiry.cron.usecase";
import { EmailService } from "../notification/notification.service";
import { SettingsNotificationsByType } from "../notification/entities/setting-notification.entity";
import { SettingsNotificationDbRepository } from "../notification/repository/db/setting-notification.repository";
import { ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { NotificationModule } from "../notification/notification.module";



@Module({
    imports: [NotificationModule],
    controllers: [ContractAlertsController],
    providers: [
       GetContractAlertsListUsecase,
       GetOneContractAlertUsecase,
       AddContractAlertUsecase,
       UpdateContractAlertUsecase,
       DeleteContractAlertUsecase,
       ContractAlertsDbRepository,
       PermissionsCheckerService,
       UserDbRepository,
       RolesDbRepository,
       ContractDbRepository,
       ContractExpiryCronUsecase,
    ],
    exports: [],
})
export class alerts { }
