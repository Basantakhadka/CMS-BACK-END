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
    title: "Dashboard",
    children: [
      { key: "dashboard:transactions", title: "Transactions" },
      { key: "dashboard:merchants", title: "Merchants" },
      { key: "dashboard:paymentPoints", title: "Payment Mode" },
      { key: "dashboard:transactionAmount", title: "Transaction Amount" },
      { key: "dashboard:transactionGraph", title: "Transaction Graph" },
    ],
  },
  {
    key: "transactions",
    title: "Transactions",
    children: [
      {
        key: "transactions:txn:acquirerTransaction:search",
        title: "Acquirer Transaction - Search",
      },
      {
        key: "transactions:txn:acquirerTransaction:summary",
        title: "Acquirer Transaction - Transaction Summary",
      },
      {
        key: "transactions:txn:acquirerTransaction:table",
        title: "Acquirer Transaction - Transaction Table",
      },
      {
        key: "transactions:txn:acquirerTransaction:adjustment",
        title: "Acquirer Transaction - Transaction Adjustment",
      },
    ],
  },
  {
    key: "merchants",
    title: "Merchants",
    children: [
      { key: "merchants:applications:summary", title: "Applications - Summary" },
      { key: "merchants:applications:table", title: "Applications - Table" },
      { key: "merchants:enrolled:summary", title: "Enrolled - Summary" },
      { key: "merchants:enrolled:table", title: "Enrolled - Table" },
      { key: "merchants:changeRequests", title: "Change Requests" },
    ],
  },
  {
    key: "serviceFee",
    title: "Service Fee",
    children: [
      { key: "serviceFee:merchantServiceFee", title: "Merchant Service Fee" },
      { key: "serviceFee:changeRequests", title: "Change Requests" },
    ],
  },
  {
    key: "reports",
    title: "Reports",
    children: [
      { key: "reports:preDisbursementReportDump", title: "Dump Pre-Disbursement Report" },
      { key: "reports:postDisbursementReport", title: "Fetch Post-Disbursement Report" },
      { key: "reports:postDisbursementReportDump", title: "Dump Post-Disbursement Report" },
      { key: "reports:networkReconciliationFailedDump", title: "Dump Failed Reconciliation Report" },
      { key: "reports:preDisbursementReport", title: "Fetch Pre-Disbursement Report" },
      { key: "reports:networkReconciliationFailed", title: "Fetch Failed Reconciliation Report" },
      { key: "reports:msfReport", title: "Fetch MSF Report" },
      { key: "reports:msfReportDump", title: "Dump MSF Report" },
      { key: "reports:payoutReportDump", title: "Dump Payout Report" },
      { key: "reports:payoutReport", title: "Fetch Payout Report" },
    ],
  },
  {
    key: "auditLog",
    title: "Audit Log",
    children: [
      { key: "auditLog:List", title: "Audit Log List" },
      { key: "auditLog:msfList", title: "Audit Log MSF List" },
      { key: "auditLog:msfDetail", title: "Audit Log MSF Detail" },
    ],
  },
  {
    key: "iam",
    title: "Identity & Access Management",
    children: [
      { key: "iam:general:passwordPolicy", title: "Password Policy" },
      { key: "iam:general:multiFactorAuthentication", title: "Multi Factor Authentication" },
      { key: "iam:users:users", title: "Users" },
      { key: "iam:users:changeRequests", title: "Users - Change Requests" },
      { key: "iam:roles:roles", title: "Roles" },
      { key: "iam:roles:changeRequests", title: "Roles - Change Requests" },
    ],
  },
];
