import { Transform } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
} from "class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	@Matches(/^[A-Za-z ]+$/, {
		message: "User name should only be alphabet",
	})
	@MaxLength(50)
	userName: string;

	@IsNotEmpty()
	@IsEmail({ message: "User ID must be an valid email" })
	@Transform(({ value }) => value.toLowerCase())
	userId: string;

	@IsNotEmpty()
	@IsString()
	employeeId: string;

	@IsNotEmpty()
	@IsString()
	branch: string;

	@IsNotEmpty()
	@IsArray()
	roles: Array<string>;

	@IsNotEmpty()
	@IsBoolean()
	active: boolean;
}
