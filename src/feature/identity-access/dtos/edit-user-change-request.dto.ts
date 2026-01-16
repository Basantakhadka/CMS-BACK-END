import { Transform } from "class-transformer";
import {
	ArrayNotEmpty,
	IsAlphanumeric,
	IsArray,
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
	ValidateIf,
} from "class-validator";

export class EditUserChangeRequestDto {
	@ValidateIf((field) => field.email)
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	@Transform(({ value }) => value.toLowerCase())
	email: string;

	@IsOptional()
	@IsString()
	comments: string;

	@ValidateIf((field) => field.userName)
	@IsNotEmpty()
	@Matches(/^[A-Za-z ]+$/, {
		message: "User name should only be alphabet",
	})
	@MaxLength(50)
	userName: string;

	@ValidateIf((field) => field.employeeId)
	@IsNotEmpty()
	@IsAlphanumeric()
	@MaxLength(50)
	employeeId: string;

	@ValidateIf((field) => field.branch)
	@IsNotEmpty()
	@IsString()
	branch: string;

	@ValidateIf((field) => field.roles)
	@IsNotEmpty()
	@IsArray()
	roles: Array<string>;

	@IsNotEmpty()
	@IsBoolean()
	active: boolean;
}
