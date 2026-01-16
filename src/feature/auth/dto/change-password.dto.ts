import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ChangePasswordDto {
	
	@ApiProperty()
	@IsString()
	@IsOptional()
	oldPassword?: string;
	
	@IsString()
	@IsNotEmpty()
	password: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	confirmPassword: string;
	@IsString()
	@IsOptional()
	otp?: string;
	@IsString()
	@IsOptional()
	username?: string;
}

