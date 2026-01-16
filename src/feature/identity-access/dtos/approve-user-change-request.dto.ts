import { IsNotEmpty, IsString } from "class-validator";

export class ApproveUserChangeRequestDto {
    @IsNotEmpty()
    @IsString()
    refId:string;
}