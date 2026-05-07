import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Injectable } from "@nestjs/common";
import { GetPermissionUsecaseRequest } from "./request/get-permission.usecase.request";
import { GetPermissionUsecaseResponse } from "./response/get-permission.usecase.response";
import { RequestContext } from "@app/core/middleware/request_context";

@Injectable()
export class GetPermissonUsecase
	implements Usecase<GetPermissionUsecaseRequest, GetPermissionUsecaseResponse> {
	async execute(
		request?: GetPermissionUsecaseRequest,
		requestContext?: RequestContext,
	): Promise<Result<GetPermissionUsecaseResponse>> {
		let response = permissionTree;

    console.log(requestContext?.getCurrentUser()?.clientCode, "requestContext?.getCurrentUser() in get permission usecase");

		// If clientCode is '000', filter out contracts and alerts
		if (requestContext?.getCurrentUser()?.clientCode === '000') {
			response = response
				.map((permission) => {
					return permission;
				})
				// Filter out the entire contracts and alerts sections
				.filter(
					(permission) =>
						permission.key !== 'contracts' && permission.key !== 'alerts',
				);
		}

		return Result.createSuccess(response);
	}
}

export const permissionTree = [
  {
    key: "dashboard",
    title: "Dashboard",
    children: [
      { key: "dashboard:contracts", title: "Contracts" },
      { key: "dashboard:alerts", title: "Alerts" },
    ],
  },
  {
    key: "contracts",
    title: "Contracts",
    children: [
      {
        key: "contracts:search",
        title: "Contracts- Search",
      },
       {
        key: "contracts:list",
        title: "Contracts- List",
      },
      {
        key: "contracts:summary",
        title: "Contracts - Summary",
      },
      {
        key: "contracts:table",
        title: "Contracts - Table",
      },
      {
        key: "contracts:add",
        title: "Contracts - Add",
      },
      {
        key: "contracts:delete",
        title: "Contracts - Delete",
      },
      {
        key: "contracts:update",
        title: "Contracts - Update",
      },
      {
        key: "contracts:view",
        title: "Contracts - View",
      },
    ],
  },
  {
    key: "alerts",
    title: "Alerts",
    children: [
      { key: "alerts::list", title: "list" },
      { key: "alerts::add", title: "Add" },
      { key: "alerts::update", title: "Update" },
      { key: "alerts::delete", title: "Delete" },
        { key: "alerts::edit", title: "Edit" },
     
    ],
  },
  {
    key: "iam",
    title: "Identity & Access Management",
    children: [
      { key: "iam:general:passwordPolicy", title: "Password Policy" },
      { key: "iam:general:multiFactorAuthentication", title: "Multi Factor Authentication" },
      { key: "iam:users:list", title: "list" },
      { key: "iam:users:add", title: "User Add" },
      { key: "iam:users:update", title: "User Update" },
      { key: "iam:users:delete", title: "User Delete" },
        { key: "iam:users:edit", title: "User Edit" },
      { key: "iam:roles:list", title: "list" },
      { key: "iam:roles:add", title: "Role Add" },
      { key: "iam:roles:update", title: "Role Update" },
      { key: "iam:roles:delete", title: "Role Delete" },
        { key: "iam:roles:edit", title: "Role Edit" },

    ],
  },
];
