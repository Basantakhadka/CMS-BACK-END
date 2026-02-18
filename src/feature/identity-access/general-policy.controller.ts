import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { RequestContext } from "@app/core/middleware/request_context";
import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { CreateGeneralPolicyDto } from "./dtos/create-general-policy.dto";
import { GetGeneralPolicyUsecase } from "./usecase/get-general-policy.usecase";
import { GetGeneralPolicyUsecaseRequest } from "./usecase/request/get-general-policy.usecase.request";
import { SaveGeneralPolicyUsecaseRequest } from "./usecase/request/save-general-policy.usecase.request";
import { SaveGeneralPolicyUsecase } from "./usecase/save-general-policy.usecase";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Identity Access | General Policy')
@Controller('identity-access/general-policy')
@UseInterceptors(PermissionInterceptor)
export class GeneralPolicyController {
	requestContext: RequestContext;
	constructor(
		private readonly saveGeneralPolicyUsecase: SaveGeneralPolicyUsecase,
		private readonly getGeneralPolicyUsecase: GetGeneralPolicyUsecase
	) { }

	@Get()
	async findGeneralPolicy() {
		const request = new GetGeneralPolicyUsecaseRequest();
		return await this.getGeneralPolicyUsecase.execute(request);
	}

	@Post()
	async saveGeneralPolicy(@Body() body: CreateGeneralPolicyDto) {
		const generalPolicy: CreateGeneralPolicyDto = body;
		const request = new SaveGeneralPolicyUsecaseRequest(
			null,                          // active
			null,                          // usersMfa
			null,                          // merchantsMfa
			generalPolicy.passwordPolicy,  // keep this
			null,                          // usersOtpSetting
			null,                          // merchantsOtpSetting
			null                           // merchantSignupOtpSetting
		);

		return await this.saveGeneralPolicyUsecase.execute(request);
	}
}
