import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject } from "@nestjs/common";
import { GeneralPolicy } from "../entities/general-policy.entity";
import { GeneralPolicyDbRepository } from "../repositories/db/general-policy.repository";
import { GeneralPolicyRepository } from "../repositories/general-policy.repository";
import { SaveGeneralPolicyUsecaseRequest } from "./request/save-general-policy.usecase.request";
import { SaveGeneralPolicyUsecaseResponse } from "./response/save-general-policy.usecase.response";
import { RequestContext } from "@app/core/middleware/request_context";
import { IdGenerator } from "@app/shared/id-generator";

export class SaveGeneralPolicyUsecase
	implements
	Usecase<SaveGeneralPolicyUsecaseRequest, SaveGeneralPolicyUsecaseResponse> {
	constructor (
		@Inject(GeneralPolicyDbRepository)
		private readonly generalPolicyRepository: GeneralPolicyRepository
	) { }

	async execute(
		request: SaveGeneralPolicyUsecaseRequest,
		requestContext?: RequestContext
	): Promise<Result<SaveGeneralPolicyUsecaseResponse>> {
		const generalPolicy = new GeneralPolicy();
		generalPolicy.active = request.active;
		generalPolicy.usersMfa = request.usersMfa;
		generalPolicy.passwordPolicy = request.passwordPolicy;
		generalPolicy.merchantsMfa = request.merchantsMfa;
		generalPolicy.usersOtpSetting = request.usersOtpSetting;
		generalPolicy.merchantsOtpSetting = request.merchantsOtpSetting;
		generalPolicy.merchantSignupOtpSetting = request.merchantSignupOtpSetting;
		let response: SaveGeneralPolicyUsecaseResponse;
		const savedGeneralPolicy = await this.generalPolicyRepository.findAll();
		if (savedGeneralPolicy?.length) {
			generalPolicy.id = savedGeneralPolicy[0].id;
			const updatedGeneralPolicy = await this.generalPolicyRepository.update(
				generalPolicy
			);
			response = new SaveGeneralPolicyUsecaseResponse(updatedGeneralPolicy);
			return Result.createSuccess(response.data);
		}
		generalPolicy.id = IdGenerator.generateId();
		const savedGeneralPolicys = await this.generalPolicyRepository.insert(
			generalPolicy
		);
		response = new SaveGeneralPolicyUsecaseResponse(savedGeneralPolicys);
		return Result.createSuccess(response.data);
	}
}
