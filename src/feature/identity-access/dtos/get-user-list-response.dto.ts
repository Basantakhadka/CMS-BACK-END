import { SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";

export class GetUserListResponseDto {
    id:string;
    userName:string;
    employeeId:string;
    userId:string;
    branch:SelectMenu;
    createdOn:string;
    status:string;
}