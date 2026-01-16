import {
	ServiceUnavailableException,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import jwtDecode from "jwt-decode";
import { CurrentUser } from "../middleware/current_user";
import { RequestContext } from "../middleware/request_context";
import { JwtStrategy } from "./JwtStrategy";
import { TokenIntegrityValidator } from "./tokenIntegrityValidator";
import { UserPoolService } from "../cache/user-pool.service";
import { MFASTATUS } from "@app/feature/constants";
import { DatabaseException } from "../exception/database.exception";
import { decrypt, encrypt } from "CMS-BACK-END/src/core/auth/encryption";
import { CacheFactory } from "../cache/cache.factory";
import { IdGenerator } from "CMS-BACK-END/src/shared/id-generator";

export class AuthTokenStrategy {
	static async parseToken(
		tokenString: string,
		jwtStrategy: JwtStrategy,
		tokenIntegrityValidator: TokenIntegrityValidator,
		userPoolService: UserPoolService
	): Promise<RequestContext> {
		if (!tokenString) {
			throw new UnauthorizedException("Token Not Provided. Unauthorized!");
		}
		let decodedToken: any;
		try {
			const decodedRawToken = jwtDecode(tokenString);

			const decryptedPayload = JSON.parse(decrypt(decodedRawToken["payload"]));

			decodedToken = {
				...decryptedPayload,
				iat: decodedRawToken["iat"],
				exp: decodedRawToken["exp"],
				iss: decodedRawToken["iss"],
				sub: decodedRawToken["sub"],
				jti: decodedRawToken["jti"],
			};

			if (!decodedToken || decodedToken["iss"] !== process.env.JWT_ISSUER) {
				throw new UnauthorizedException(
					"Sorry User is not authorized to access this resources"
				);
			}

			await jwtStrategy.verify(tokenString);

			const currentUser = new CurrentUser(
				decodedToken["sub"],
				decodedToken["userId"],
				decodedToken["fullName"],
				decodedToken["institutionCode"],
				decodedToken["schema"],
				decodedToken["username"],
				decodedToken["institutionType"]
			);
			// await tokenIntegrityValidator.validateToken(decodedToken);

			if (
				!decodedToken["enforcePasswordChange"] &&
				decodedToken["MFAStatus"] !== MFASTATUS.PENDING
			) {
				await userPoolService.validateSession(
					decodedToken["userId"],
					decodedToken["institutionCode"],
					decodedToken["sessionId"]
				);

				await userPoolService.refreshSession(
					decodedToken["userId"],
					decodedToken["institutionCode"]
				);
			}

			return new RequestContext(currentUser, decodedRawToken["jti"]);
		} catch (err) {
			console.log("TOKEN EXCEPTION::::",err)
			if (err instanceof DatabaseException) {
				throw new ServiceUnavailableException(
					"Service Temporarily Unavailable"
				);
			} else {
				if (decodedToken) {
					userPoolService.revokeSession(
						decodedToken["userId"],
						decodedToken["institutionCode"]
					);
				}
				throw new UnauthorizedException(
					"Token expired or invalid. Unauthorized!"
				);
			}
		}
	}

	static async updateToken(
		tokenString: string,
		userPoolService: UserPoolService,
		cacheFactory?: CacheFactory,
		requestUrl?:string
	) {
		if (!tokenString) {
			throw new UnauthorizedException("Token Not Provided. Unauthorized!");
		}
		try {
			const decodedRawToken = jwtDecode(tokenString);
			const decryptedPayload = JSON.parse(decrypt(decodedRawToken["payload"]));

			const decodedToken = {
				...decryptedPayload,
				iat: decodedRawToken["iat"],
				exp: decodedRawToken["exp"],
				iss: decodedRawToken["iss"],
				sub: decodedRawToken["sub"],
				jti: decodedRawToken["jti"],
			};

			if (!decodedToken || decodedToken["iss"] !== process.env.JWT_ISSUER) {
				throw new UnauthorizedException();
			}

			const payload = {
				userId: decodedToken["userId"],
				version: decodedToken["version"],
				fullName: decodedToken["fullName"],
				institutionCode: decodedToken["institutionCode"],
				roles: decodedToken["roles"],
				username: decodedToken["username"],
				schema: decodedToken["schema"],
				enforcePasswordChange: decodedToken["enforcePasswordChange"],
				MFAStatus: decodedToken["MFAStatus"],
				institutionType: decodedToken["institutionType"],
				sessionId: decodedToken["sessionId"],
			};

			const encryptedPayload = encrypt(JSON.stringify(payload));

			const jwtService = new JwtService({
				secret: process.env.SECRET_JWT_KEY,
				signOptions: {
					algorithm: "HS512",
					subject: decodedToken["sub"],
					expiresIn: +process.env.JWT_EXPIRES_IN,
					issuer: process.env.JWT_ISSUER,
				},
			});

			jwtService.verify(tokenString);

			const jwtSignOption: JwtSignOptions = {
				subject: decodedRawToken["sub"],
				jwtid: decodedRawToken["jti"],
			};

			const accessToken = jwtService.sign(
				{ payload: encryptedPayload },
				jwtSignOption
			);

			if(!requestUrl?.includes("logout")) {
				await cacheFactory.cacheData(decodedRawToken["jti"], accessToken, {
					ttl: +process.env.JWT_EXPIRES_IN,
				});
			}
			return accessToken;
		} catch (err) {
			throw new UnauthorizedException(
				"Token expired or invalid. Unauthorized!"
			);
		}
	}
}
