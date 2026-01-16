import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { CreateRoleDto, RoleDto } from "./create-role.dto";

export class UpdateRoleDto extends RoleDto{

}