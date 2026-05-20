import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

export class RoleDto {
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsBoolean()
    active: boolean;

    @IsArray()
    @IsNotEmpty()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @MinLength(1, { each: true })
    permissions: Array<string>

    @IsOptional()
    contractIds?: Array<string>;
}

export class CreateRoleDto extends RoleDto {

}