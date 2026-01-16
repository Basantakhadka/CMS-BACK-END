import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { Inject } from "@nestjs/common";
import { GeneralPolicy } from "../entities/general-policy.entity";
import { GeneralPolicyDbRepository } from "../repositories/db/general-policy.repository";
import { GeneralPolicyRepository } from "../repositories/general-policy.repository";
import { GetGeneralPolicyUsecaseRequest } from "./requests/get-general-policy.usecase.request";
import { GetGeneralPolicyUsecaseResponse } from "./response/get-general-policy.usecase.response";

export class GetGeneralPolicyUsecase
  implements
    Usecase<GetGeneralPolicyUsecaseRequest, GetGeneralPolicyUsecaseResponse>
{
  constructor(
    @Inject(GeneralPolicyDbRepository)
    private readonly generalPolicyRepository: GeneralPolicyRepository
  ) {}
  async execute(
    request?: GetGeneralPolicyUsecaseRequest
  ): Promise<Result<GetGeneralPolicyUsecaseResponse>> {
    const generalPolicy = await this.generalPolicyRepository.findAll();
    let response: GetGeneralPolicyUsecaseResponse;
    if (generalPolicy && generalPolicy.length > 0) {
      response = new GetGeneralPolicyUsecaseResponse(generalPolicy[0]);
    } else {
      const generalPolicy = new GeneralPolicy();
      response = new GetGeneralPolicyUsecaseResponse({ ...generalPolicy });
    }
    return Result.createSuccess(response.data);
  }
}
