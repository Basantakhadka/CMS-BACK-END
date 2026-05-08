import { ContractAlert } from "@app/feature/alerts/entities/alerts.entity";
import { Contract } from "@app/feature/contracts/entities/contracts.entity";
import { ContractChangeRequest } from "@app/feature/contracts/entities/contract-change-request.entity";
import { Client } from "@app/feature/identity-access/entities/client.entity";
import { GeneralPolicy } from "@app/feature/identity-access/entities/general-policy.entity";
import { Role } from "@app/feature/identity-access/entities/roles.entity";
import { UserCredential } from "@app/feature/identity-access/entities/user-credential.entity";
import { User, UserByRole } from "@app/feature/identity-access/entities/user.entity";
import { SettingsNotificationsByType } from "@app/feature/notification/entities/setting-notification.entity";
import { AuditLog } from "@app/feature/audit-log/entities/audit-log.entity";

export const entities = [
    Client,
    User,
    UserCredential,
    UserByRole,
    GeneralPolicy,
    Role,
    Contract,
    ContractChangeRequest,
    ContractAlert,
    SettingsNotificationsByType,
    AuditLog,
    
];
