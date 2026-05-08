// usecase/get-client-list.usecase.ts
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { Inject, NotFoundException } from "@nestjs/common";


import { GetClientListUsecaseRequest } from "./request/get-client-list.usecase.request";
import { GetClientListUsecaseResponse } from "./response/get-client-list.usecase.response";
import { ClientDbRepository } from "../repositories/db/client.repository";
import { ClientRepository } from "../repositories/client.repository";
import { GetClientResponseDto } from "../dtos/client-list.dtos";


export class GetClientListUsecase
  implements Usecase<GetClientListUsecaseRequest, GetClientListUsecaseResponse>
{
  constructor(
    @Inject(ClientDbRepository)
    private readonly clientRepository: ClientRepository
  ) { }

  async execute(
    request: GetClientListUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<GetClientListUsecaseResponse>> {

    // 1️⃣ Get paginated clients
    const clientsList = await this.clientRepository.findAllAndResponseWithPagination(
      request.data,
      request.data.pageInfo
    );

    if (!clientsList || clientsList.getElements().length === 0) {
      return Result.createErrorWithMessage(
        new NotFoundException(),
        "No clients found"
      );
    }

    // 2️⃣ Map clients to response DTO
    const clientsResponse: GetClientResponseDto[] = [];
    const elements = clientsList.getElements();

    elements.forEach((client: any) => {
      const dto = new GetClientResponseDto();
      dto.client_code = client.client_code;
      dto.client_name = client.client_name;

      clientsResponse.push(dto);
    });

    // 3️⃣ Prepare pagination info
    const pageInfo = new PageInfoDto();
    pageInfo.current = clientsList.getCurrentPage();
    pageInfo.size = clientsList.getSize();

    // 4️⃣ Return response
    const response = new GetClientListUsecaseResponse(clientsResponse, pageInfo);
    return Result.createSuccess(response);
  }
}
