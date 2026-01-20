import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { encrypt } from "@app/core/auth/encryption";

export class JwtStrategy {
	constructor(private jwtService: JwtService) {
		this.jwtService = new JwtService({
			secret: process.env.SECRET_JWT_KEY,
			signOptions: {
				algorithm: "HS512",
				expiresIn: +process.env.JWT_EXPIRES_IN,
				issuer: process.env.JWT_ISSUER,
			},
			verifyOptions: {
				algorithms: ["HS512"],
				issuer: process.env.JWT_ISSUER,
			},
		});
	}

	sign(payload: string | object | Buffer, jwtSignOptions: JwtSignOptions) {
		const encryptedPayload = encrypt(JSON.stringify(payload));
		return this.jwtService.sign(
			{ payload: encryptedPayload },
			{
				...jwtSignOptions,
			}
		);
	}

	async verify(token: string) {
		return await this.jwtService.verify(token);
	}

	decode(token: string) {
		return this.jwtService.decode(token);
	}
}
