import { SettingsNotificationsByType } from "CMS-BACK-END/src/core/notification/entities/setting-notification.entity";
import { Otp } from "CMS-BACK-END/src/core/otp/otp.entity";
import { BankBranch } from "CMS-BACK-END/src/feature/identity-access/entities/bank-branch.entity";
import {
    User,
    UserByRole,
} from "CMS-BACK-END/src/feature/identity-access/entities/user.entity";
import { GeneralPolicy } from "CMS-BACK-END/src/feature/identity-access/entities/general-policy.entity";
import {
    Role,
    RoleChangeRequest,
} from "CMS-BACK-END/src/feature/identity-access/entities/roles.entity";
import { UserChangeRequest } from "CMS-BACK-END/src/feature/identity-access/entities/user-change-request.entity";
import { UserCredential } from "CMS-BACK-END/src/feature/identity-access/entities/user-credential.entity";
import { Contract } from "CMS-BACK-END/src/feature/contracts/entities/contract.entity";

export const entities = [
    // Core entities
    SettingsNotificationsByType,
    Otp,

    // Identity & Access entities
    BankBranch,
    User,
    UserByRole,
    GeneralPolicy,
    Role,
    RoleChangeRequest,
    UserChangeRequest,
    UserCredential,

    // Contract Management entities
    Contract,
];

} from "@app/feature/merchants-onboarding/entities/merchant-application-company-documents.entity";
import {
    MerchantApplicationsOwnersEntity
} from "@app/feature/merchants-onboarding/entities/merchant-applications-owners.entity";
import {MerchantApplicationsEntity} from "@app/feature/merchants-onboarding/entities/merchant-applications.entity";
import {MerchantUsersByMemberEntity} from "@app/feature/shared-configurations/entities/merchant-users-by-member.entity";
import {SystemConfigByMemberEntity} from "@app/feature/system-configuration/entities/system-config-by-member.entity";
import {SystemConfigsEntity} from "@app/feature/system-configuration/entities/system-configs.entity";
import {MerchantStatementAccount} from "@app/feature/reports/entities/merchant-statement-account.entity";
import {IssuersTransactionsEntity} from "@app/feature/transactions/entities/issuers-transactions.entity";
import {MerchantAccountBalanceEntity} from "@app/feature/enrolled-merchants/entities/merchant-account-balance.entity";
import {ReportExportJobEntity} from "@app/feature/report-jobs/entities/report-export-job.entity";
import {MerchantGenerateQrLogEntity} from "@app/feature/enrolled-merchants/entities/merchant-generate-qr-log.entity";
import {DiscountAppliedTransactionView} from "@app/feature/reports/entities/discount-applied-transaction.view";
import {
    IssuersTransactionsSummaryByTransactionTypeAndTransactionStatusEntity
} from "@app/feature/transactions/entities/issuers-transactions-summary-by-transaction-type-and-transaction-status.entity";
import {PaymentModesEntity} from "@app/feature/service-fees/entities/payment-modes.entity";
import {FundTransferLogsEntity} from "@app/feature/reports/entities/fund-transfer-log.entity";
import {MerchantUserRolesEntity} from "CMS-BACK-END/src/feature/identity-access/entities/merchant-user-roles.entity";
import {
    MessagingManagementSettingsEntity
} from "@app/feature/messaging-management-settings/entities/messaging-management-settings.entity";
import {RisksManagementEntity} from "@app/feature/risk-management/entities/risks-management.entity";
import {RiskTransactionVelocityEntity} from "@app/feature/risk-management/entities/risks-transaction-velocity.entity";
import {RiskTransactionVolumeEntity} from "@app/feature/risk-management/entities/risks-transaction-volume.entity";
import {RiskAffectedMerchantsView} from "@app/feature/risk-management/entities/risk-affected-merchants.view";
import {MerchantAffectedByRiskView} from "@app/feature/risk-management/entities/merchant-affected-by-risk.view";
import {ChangeRequestEntity} from "@app/feature/change-requests/entities/change-request.entity";
import {Member} from "@app/feature/enrolled-merchants/entities/operator-institution.entity";
import {TransactionMasterEntity} from "@app/feature/transactions/entities/transaction-master.entity";
import {TransactionDetailsEntity} from "@app/feature/transactions/entities/transaction-details.entity";
import {NetworkProcessorEntity} from "@app/feature/network-processor/entities/network-processor.entity";
import {PaymentNetworksEntity} from "@app/feature/network-processor/entities/payment-networks.entity";
import {ConfigurationRecordsEntity} from "@app/feature/merchants-onboarding/entities/configuration-records";
import {IdGenerationConfig} from '@app/feature/enrolled-merchants/entities/id-generation-config.entity';
import {SettlementParties} from "@app/feature/merchants-onboarding/entities/settlement-parties.entity";

export const entities = [
    CustomSerialsEntity,
    User,
    Otp,
    SettingsNotificationsByType,
    Customer,
    DisputeEntity,
    DisputeId,
    BankBranch,
    GeneralPolicy,
    Role,
    UserChangeRequest,
    RoleChangeRequest,
    UserByRole,
    UserCredential,
    MerchantCategoryCodesEntity,
    MsfChangeRequest,
    ServiceFeeDetailsByMccEntity,
    ServiceFeesByMccEntity,
    SystemConfigurationEntity,
    IssuersDisputeSummaryEntity,
    MerchantsLatestActivitiesEntity,
    TransactionsSummaryByTransactionTypeAndTransactionStatusEntity,
    Transactions,
    WorkflowDetail,
    WorkflowGroup,
    WorkflowTask,
    Workflow,
    MerchantCompanyDocsEntity,
    MerchantOwnersEntity,
    MerchantUser,
    Merchant,
    MerchantOutletEntity,
    MerchantPagsEntity,
    MerchantPapsEntity,
    MerchantSettlementBankEntity,
    MerchantSettlementWalletEntity,
    LookupDataEntity,
    MemberBranchesEntity,
    MerchantApplicationsCompanyDocsEntity,
    MerchantApplicationsOwnersEntity,
    MerchantApplicationsEntity,
    MerchantUsersByMemberEntity,
    SystemConfigByMemberEntity,
    SystemConfigsEntity,
    MerchantStatementAccount,
    IssuersTransactionsEntity,
    ChangeRequestEntity,
    MerchantAccountBalanceEntity,
    ReportExportJobEntity,
    MerchantGenerateQrLogEntity,
    DiscountAppliedTransactionView,
    IssuersTransactionsSummaryByTransactionTypeAndTransactionStatusEntity,
    PaymentModesEntity,
    FundTransferLogsEntity,
    MerchantUserRolesEntity,
    Member,
    MessagingManagementSettingsEntity,
    RisksManagementEntity,
    RiskTransactionVelocityEntity,
    RiskTransactionVolumeEntity,
    RiskAffectedMerchantsView,
    MerchantAffectedByRiskView,
    ChangeRequestEntity,
    TransactionMasterEntity,
    TransactionDetailsEntity,
    NetworkProcessorEntity,
    ConfigurationRecordsEntity,
    PaymentNetworksEntity,
    IdGenerationConfig,
    SettlementParties
];
