import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtStrategy } from "@app/core/auth/JwtStrategy";
import { Result } from "./feature/common/result";

@Injectable()
export class AppService {
	constructor(private jwtStrategy: JwtStrategy) {}

	public getHello(): string {
		return "Hello World!";
	}

	async validateToken(token: string) {
		const isTokenValid = await this.jwtStrategy.verify(token);
		if (!isTokenValid) {
			return Result.createError(new BadRequestException("Token is invalid!"));

		}
		return { tokenValid: true };
	}
}
