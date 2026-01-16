import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

export class EditRoleChangeRequestDto{
    
    @ValidateIf((field)=> field.title)
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    title:string;

    @ValidateIf((field)=> field.active)
    @IsNotEmpty()
    @IsBoolean()
    active:boolean;

    @ValidateIf((field)=> field.permissions)
    @IsArray()
    @IsNotEmpty()
    @ArrayNotEmpty()
    @IsString({ each:true })
    @MinLength(1,{each:true})
    permissions:Array<string>
}

