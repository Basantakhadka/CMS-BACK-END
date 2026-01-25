import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { DateTimePatternType } from "@app/shared/constants/datetime-format.constants";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { Inject, NotFoundException } from "@nestjs/common";
import { GetUserListResponseDto } from "../dtos/get-user-list-response.dto";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserRepository } from "../repositories/user.repository";
import { GetUsersListUsecaseRequest } from "./request/get-users-list.usecase.request";
import { GetUsersListUsecaseResponse } from "./response/get-users-list.usecase.response";
import { IamEntityStatus } from "@app/shared/constants/Iam-entity-status";
import { DateUtils } from "@app/shared/utils/date-utils";

export class GetUsersListUsecase
	implements Usecase<GetUsersListUsecaseRequest, GetUsersListUsecaseResponse> {
	constructor (
		@Inject(UserDbRepository)
		private readonly userRepository: UserRepository
	) { }
	async execute(
		request: GetUsersListUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<GetUsersListUsecaseResponse>> {
		const usersList =
			await this.userRepository.findAllAndResponseWithPagination(
				request.data,
				request.data.pageInfo
			);
		let usersResponse: GetUserListResponseDto[] = [];
		if (!usersResponse) {
			return Result.createErrorWithMessage(
				new NotFoundException(),
				"No user found"
			);
		} else {
			let elements = [];
			let elementWithchangedColumnsNames = [];
			elements = usersList.getElements();
			elements.forEach((user) => {
				const users = new GetUserListResponseDto();
				users.id = user.id;
				users.userName = user.userName;
				users.employeeId = user.employeeId;
				users.userId = user.userId;

				users.createdOn = user.createdOn
					? DateUtils.formatDateTime(
						user.createdOn,
						DateTimePatternType.MMM_DD_YYYY_HMS.displayname
					)
					: null;
				users.status = IamEntityStatus.getByBoolValue(user.active) ? IamEntityStatus.getByBoolValue(user.active).userStatus : "-";
				usersResponse.push(users);
			});
			let pageInfos = new PageInfoDto();
			pageInfos.current = usersList.getCurrentPage();
			pageInfos.size = usersList.getSize();

			const response = new GetUsersListUsecaseResponse(
				usersResponse,
				pageInfos
			);
			return Result.createSuccess(response);
		}
	}
}