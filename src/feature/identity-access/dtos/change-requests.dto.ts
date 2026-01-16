import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

export class ApproveChangeRequestDto{
    @IsString()
    @IsNotEmpty()
    roleId:string;
}

export class ViewChangeRequestDto{
    @IsNotEmpty()
    @IsString()
    roleId:string
}