import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserLoginDto {
	@ApiProperty({
		default: 'superone@getpay.com',
	  })
	@IsEmail()
	@IsNotEmpty()
	@Transform(({ value }) => value.toLowerCase())
	username: string;

	@ApiProperty({
		default: 'T35t@123',
	  })
	@IsString()
	@IsNotEmpty()
	password: string;
}
