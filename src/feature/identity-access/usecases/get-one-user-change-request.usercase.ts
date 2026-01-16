import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ChangeRequestStatus } from "CMS-BACK-END/src/shared/constants/change-request-status.constant";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import {
  Field,
  ChangeRequisitionDetailResponseDto,
} from "../../../shared/dtos/change-requisition-detail-response";
import { UserChangeRequest } from "../entities/user-change-request.entity";
import { User } from "../entities/user.entity";
import { UserChangeRequestDbRepository } from "../repositories/db/user-change-request.repository";
import { UserDbRepository } from "../repositories/db/user.repository";
import { UserChangeRequestRepository } from "../repositories/user-change-request.repository";
import { UserRepository } from "../repositories/user.repository";
import { GetOneUserChangeRequestUsecaseRequest } from "./requests/get-one-user-change-request.usercase.request";
import { GetOneUserChangeRequestUsecaseResponse } from "./response/get-one-user-change-request.usercase.response";
import { IamEntityStatus } from "CMS-BACK-END/src/shared/constants/Iam-entity-status";

export class GetOneUserChangeRequestUsecase implements Usecase<GetOneUserChangeRequestUsecaseRequest, GetOneUserChangeRequestUsecaseResponse>{
  constructor(
      @Inject(UserChangeRequestDbRepository)
      private readonly userChangeRequestRepository: UserChangeRequestRepository,
      @Inject(UserDbRepository)
      private readonly userRepostiory: UserRepository
  ){}

  async execute(request: GetOneUserChangeRequestUsecaseRequest, requestContext?: RequestContext): Promise<Result<GetOneUserChangeRequestUsecaseResponse>>{
      const savedUserChangeRequest = await this.validatePendingRequest(request.id, request.refId);
      const savedUser = await this.userRepostiory.findById(savedUserChangeRequest.refId);
      const result = this.generateResponse(savedUser, savedUserChangeRequest);
      const response = new GetOneUserChangeRequestUsecaseResponse(result);
      return Result.createSuccess(response.data);
  }

  private async validatePendingRequest(id:string, refId:string){
    const userChangeRequest = new UserChangeRequest();
    userChangeRequest.id = id;
    userChangeRequest.refId = refId;
    const savedUserChangeRequestList = await this.userChangeRequestRepository.findByIds(userChangeRequest);
    const savedUserChangeRequest = savedUserChangeRequestList[0];
    
    if(!savedUserChangeRequest){
      Result.createError(new NotFoundException("Cannot find the users"));
    }
    return savedUserChangeRequest;
  }
  
  private generateResponse(savedUser:User, savedUserChangeRequest:UserChangeRequest){
    let result: ChangeRequisitionDetailResponseDto;
      const fields: Field[] = [
        {
          label: "User Name",
          value: "userName",
        },
        {
          label: "User ID",
          value: "userId",
        },
        {
          label: "Employee ID",
          value: "employeeId",
        },
        {
          label: "Branch",
          value: "branch",
        },
        {
          label: "Role",
          value: "roles",
        },
        {
          label: "Status",
          value: "status",
        }
      ];
      const originalValue = {
        userName: savedUser ? savedUser.userName : null,
        userId: savedUser ? savedUser.userId : null,
        employeeId: savedUser ? savedUser.employeeId : null,
        branch: savedUser ? savedUser.branch : null,
        roles: savedUser ? savedUser.roles : null,
        status: savedUser ? {label: IamEntityStatus.getByBoolValue(savedUser.active)?.userStatus, value: savedUser.active} : null,
      };

      const changedValue = {
        userName: savedUserChangeRequest
          ? savedUserChangeRequest.userName
          : null,
        userId: savedUserChangeRequest ? savedUserChangeRequest.userId : null,
        employeeId: savedUserChangeRequest
          ? savedUserChangeRequest.employeeId
          : null,
        branch: savedUserChangeRequest ? savedUserChangeRequest.branch : null,
        roles: savedUserChangeRequest ? savedUserChangeRequest.roles : null,
        status: savedUserChangeRequest ? {label: IamEntityStatus.getByBoolValue(savedUserChangeRequest.active)?.userStatus, value: savedUserChangeRequest.active} : null
      };
      
      result = {
        id:savedUserChangeRequest.id,
        refId:savedUserChangeRequest.refId,
        fields,
        originalValue,
        changedValue,
        type: ChangeRequestType.getByName(savedUserChangeRequest.type)?.displayname,
        status: ChangeRequestStatus.getByName(savedUserChangeRequest.status)?.displayname,
        requestedBy: savedUserChangeRequest.requestedBy.label,
        userName: savedUser ? savedUser.userName : savedUserChangeRequest.userName
      };
      return result;
  }
}
