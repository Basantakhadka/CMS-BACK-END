import { TaskStatus } from "CMS-BACK-END/src/shared/constants/change-request-detail-task-status.constant";
import { TaskType } from "CMS-BACK-END/src/shared/constants/change-request-detail-task-type.constant";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";

export class GetUserChangeRequestListResponseDto {
    id:string;
    refId: string;
    userName:string;
    employeeId:string;
    userId:string;
    branch:SelectMenu;
    type:string;
    status:string;
    requestedOn:string;
    requestedBy:LabelValuePair;
}