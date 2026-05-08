import { UsecaseResponse } from "@app/core/usecase/usecase.response";
import { PageInfoDto } from "@app/shared/dtos/filter-conditions.dto";
import { GetClientResponseDto } from "../../dtos/client-list.dtos";


export class GetClientListUsecaseResponse implements UsecaseResponse {
  constructor(
    public list: GetClientResponseDto[],
    public pageInfo: PageInfoDto
  ) { }
}
