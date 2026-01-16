import { PermissionInterceptor } from "CMS-BACK-END/src/core/interceptors/permission.interceptor";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { CreateGeneralPolicyDto } from "./dtos/create-general-policy.dto";
import { GetGeneralPolicyUsecase } from "./usecases/get-general-policy.usecase";
import { GetGeneralPolicyUsecaseRequest } from "./usecases/requests/get-general-policy.usecase.request";
import { SaveGeneralPolicyUsecaseRequest } from "./usecases/requests/save-general-policy.usecase.request";
import { SaveGeneralPolicyUsecase } from "./usecases/save-general-policy.usecase";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Identity Access | General Policy')
@Controller('identity-access/general-policy')
@UseInterceptors(PermissionInterceptor)
export class GeneralPolicyController {
	requestContext: RequestContext;
	constructor(
		private readonly saveGeneralPolicyUsecase: SaveGeneralPolicyUsecase,
		private readonly getGeneralPolicyUsecase: GetGeneralPolicyUsecase
	) {}

	@Get()
	async findGeneralPolicy() {
		const request = new GetGeneralPolicyUsecaseRequest();
		return await this.getGeneralPolicyUsecase.execute(request);
	}

	@Post()
	async saveGeneralPolicy(@Body() body: CreateGeneralPolicyDto) {
		const generalPolicy: CreateGeneralPolicyDto = body;
		const request = new SaveGeneralPolicyUsecaseRequest(
			generalPolicy.active,
			generalPolicy.usersMfa,
			generalPolicy.merchantsMfa,
			generalPolicy.passwordPolicy,
			generalPolicy.usersOtpSetting,
			generalPolicy.merchantsOtpSetting,
			generalPolicy.merchantSignupOtpSetting
		);
		return await this.saveGeneralPolicyUsecase.execute(request);
	}
}
