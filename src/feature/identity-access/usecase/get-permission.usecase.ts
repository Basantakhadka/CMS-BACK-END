import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Injectable } from "@nestjs/common";
import { GetPermissionUsecaseRequest } from "./request/get-permission.usecase.request";
import { GetPermissionUsecaseResponse } from "./response/get-permission.usecase.response";
@Injectable()
export class GetPermissonUsecase
	implements Usecase<GetPermissionUsecaseRequest, GetPermissionUsecaseResponse> {
	async execute(
		request?: GetPermissionUsecaseRequest
	): Promise<Result<GetPermissionUsecaseResponse>> {
		const response = permissionTree;
		return Result.createSuccess(response);
	}
}

export const permissionTree = [
	{
		key: "dashboard",
		label: "Dashboard",
		groups: null,
		permissions: [
			{
				key: "dashboard:transactions",
				label: "Transactions",
			},
			{
				key: "dashboard:merchants",
				label: "Merchants",
			},
			{
				key: "dashboard:paymentPoints",
				label: "Payment Mode",
			},
			{
				key: "dashboard:transactionAmount",
				label: "Transaction Amount",
			},
			{
				key: "dashboard:transactionGraph",
				label: "Transaction Graph",
			},
		],
	},
	{
		key: "transactions",
		label: "Transactions",
		groups: [
			{
				key: "transactions:txn:acquirerTransaction",
				label: "Acquirer Transaction",
				groups: null,
				permissions: [
					{
						key: "transactions:txn:acquirerTransaction:search",
						label: "Search",
					},
					{
						key: "transactions:txn:acquirerTransaction:summary",
						label: "Transaction Summary",
					},
					{
						key: "transactions:txn:acquirerTransaction:table",
						label: "Transaction Table",
					},
					{
						key: "transactions:txn:acquirerTransaction:adjustment",
						label: "Transaction Adjustment",
					},
				],
			},
		],
		permissions: null,
	},
	{
		key: "merchants",
		label: "Merchants",
		groups: [
			{
				key: "merchants:applications",
				label: "Applications",
				groups: null,
				permissions: [
					{
						key: "merchants:applications:summary",
						label: "Application Summary",
					},
					{
						key: "merchants:applications:table",
						label: "Application Table",
					},
				],
			},
			{
				key: "merchants:enrolled",
				label: "Enrolled",
				groups: null,
				permissions: [
					{
						key: "merchants:enrolled:summary",
						label: "Enrolled Merchants Summary",
					},
					{
						key: "merchants:enrolled:table",
						label: "Enrolled merchants Table",
					},
				],
			},
		],
		permissions: [
			{
				key: "merchants:changeRequests",
				label: "Change Requests",
			},
		],
	},
	// {
	//   key: "riskManagement",
	//   label: "Risk Management",
	//   groups: null,
	//   permissions: [
	//     {
	//       key: "riskManagement:settings",
	//       label: "Risk Settings"
	//     },
	//     {
	//       key: "riskManagement:changeRequests", // Will be implemented in future.
	//       label: "Change Requests"
	//     },
	//     {
	//       key: "riskManagement:parameterList",
	//       label: "Risk Parameter List"
	//     }
	//   ]
	// },
	{
		key: "serviceFee",
		label: "Service Fee",
		groups: null,
		permissions: [
			{
				key: "serviceFee:merchantServiceFee",
				label: "Merchant Service Fee",
			},
			{
				key: "serviceFee:changeRequests",
				label: "Change Requests",
			},
		],
	},
	{
		key: "reports",
		label: "Reports",
		groups: null,
		permissions: [
			{
				key: "reports:preDisbursementReportDump",
				label: "Dump Pre-Disbursement Report",
			},
			{
				key: "reports:postDisbursementReport",
				label: "Fetch Post-Disbursement Report",
			},
			{
				key: "reports:postDisbursementReportDump",
				label: "Dump Post-Disbursement Report",
			},
			{
				key: "reports:networkReconciliationFailedDump",
				label: "Dump Failed Reconciliation Report",
			},
			{
				key: "reports:preDisbursementReport",
				label: "Fetch Pre-Disbursement Report",
			},
			{
				key: "reports:networkReconciliationFailed",
				label: "Fetch Failed Reconciliation Report",
			},
			{
				key: "reports:msfReport",
				label: "Fetch MSF Report",
			},
			{
				key: "reports:settlementHoldReportDump",
				label: "Dump Settlement Hold Report",
				hidden: true,
			},
			{
				key: "reports:msfReportDump",
				label: "Dump MSF Report",
			},
			{
				key: "reports:settlementHoldReport",
				label: "Fetch Settlement Hold Report",
				hidden: true,
			},
			{
				key: "reports:settlementFailedReport",
				label: "Fetch Settlement Failed Report",
				hidden: true,
			},
			{
				key: "reports:payoutReportDump",
				label: "Dump Payout Report",
			},
			{
				key: "reports:payoutReport",
				label: "Fetch Payout Report",
			},
			{
				key: "reports:settlementFailedReportDump",
				label: "Dump Settlement Failed Report",
				hidden: true,
			},
		]
	},
	{
		key: "auditLog",
		label: "Audit Log",
		groups: null,
		permissions: [
			{
				key: "auditLog:List",
				label: "Audit Log List",
			},
			{
				key: "auditLog:msfList",
				label: "Audit Log MSF List",
			},
			{
				key: "auditLog:msfDetail",
				label: "Audit Log MSF Detail",
			},
		],
	},
	{
		key: "workflow",
		label: "Approval Work Flow",
		groups: [
			{
				key: "workflow:merchantOnboarding",
				label: "Merchant Onboarding",
				groups: null,
				permissions: [
					{
						key: "workflow:merchantOnboarding:self",
						label: "Self",
					},
					{
						key: "workflow:merchantOnboarding:backOffice",
						label: "Back Office",
					},
				],
			},
		],
		permissions: [
			{
				key: "workflow:merchantInformationModification",
				label: "Merchant Information Modification",
			},
			{
				key: "workflow:iamCreation",
				label: "IAM Creation Workflow",
			},
			{
				key: "workflow:iamModification",
				label: "IAM Modification Workflow",
			},
			{
				key: "workflow:msfCreation",
				label: "Merchant Service Fee Creation",
			},
			{
				key: "workflow:msfModification",
				label: "Merchant Service Fee Modification",
			},
			{
				key: "workflow:networkProcessorOnboarding",
				label: "Network/Processor Onboarding",
			},
			{
				key: "workflow:networkProcessorModification",
				label: "Network/Processor Modification",
			},
		],
	},
	{
		key: "networkProcessor",
		label: "Network/Processor",
		groups: null,
		permissions: [
			{
				key: "networkProcessor:networkProcessorList",
				label: "Network/Processor List",
			},
			{
				key: "networkProcessor:changeRequest",
				label: "Change Requests",
			},
			{
				key: "networkProcessor:idConfigurationList",
				label: "IdConfiguration List",
			},
			{
				key: "idConfiguration:changeRequest",
				label: "IdConfiguration Change Request",
			},
		],
	},
	{
		key: "iam",
		label: "Identity & Access Management",
		groups: [
			{
				key: "iam:general",
				label: "General",
				groups: null,
				permissions: [
					{
						key: "iam:general:passwordPolicy",
						label: "Password Policy",
					},
					{
						key: "iam:general:multiFactorAuthentication",
						label: "Multi Factor Authentication",
					},
				],
			},
			{
				key: "iam:users",
				label: "Users",
				groups: null,
				permissions: [
					{
						key: "iam:users:users",
						label: "Users",
					},
					{
						key: "iam:users:changeRequests",
						label: "Change Requests",
					},
				],
			},
			{
				key: "iam:roles",
				label: "Roles",
				groups: null,
				permissions: [
					{
						key: "iam:roles:roles",
						label: "Roles",
					},
					{
						key: "iam:roles:changeRequests",
						label: "Change Requests",
					},
				],
			},
		],
		permissions: null,
	},
	// {
	// 	key: "reports",
	// 	label: "Reports",
	// 	groups: [
	// 		{
	// 			key: "reports:merchants",
	// 			label: "Reports - Merchants",
	// 			groups: null,
	// 			permissions: [
	// 				{
	// 					key: "reports:merchant:settlementTransactionReport",
	// 					label: "Settlement Transaction Report",
	// 				},
	// 				{
	// 					key:'reports:merchant:settlementHoldReport',
	// 					label:'Settlement Hold Report',
	// 				}
	// 			],
	// 		},
	// 	],
	// 	permissions: null,
	// },
	{
		key: "fileUpload",
		label: "File Upload",
		groups: null,
		permissions: [
			{
				key: "fileUpload:fileUpload", // Will be implemented in future.
				label: "File Upload",
			},
		],
	},
	{
		key: "manualDisbursement",
		label: "Manual Disbursement",
		groups: null,
		permissions: [
			{
				key: "manualDisbursement:merchantDisbursement",
				label: "Merchant Disbursement",
			},
			{
				key: "manualDisbursement:msfDisbursement",
				label: "Msf Disbursement",
			},
			{
				key: "manualDisbursement:manualDisbursement:selected",
				label: "Selected Manual Disbursement",
			},
			{
				key: "manualDisbursement:manualDisbursement:all",
				label: "All Manual Disbursement",
			},
		],
	},
	{
		key: "systemConfig",
		label: "System Configuration",
		groups: [
			{
				key: "systemConfig:merchantConfig",
				label: "Merchant Configuration",
				groups: null,
				permissions: [
					{
						key: "systemConfig:merchantConfig:bypassActivation",
						label: "Bypass Merchant Activation",
					},
				],
			},
		],
		permissions: null,
	},
	{
		key: "systemSettings",
		label: "System Settings",
		groups: null,
		permissions: [
			{
				key: "systemSettings:globalConfigurations",
				label: "Global Configurations",
			},
			{
				key: "systemSettings:systemConfigurations",
				label: "System Configurations",
			},
			{
				key: "systemSettings:networkConfigurations",
				label: "Network Configurations",
			},
			{
				key: "systemSettings:onboardingConfigurations",
				label: "Onboarding Configurations",
			},
		],
	},
];
