// import { UserCredentialDbRepository } from "@app/feature/identity-access/repositories/db/user-credential.repository";
// import { UserCredentialRepository } from "@app/feature/identity-access/repositories/user-credential.repository";
import { Inject, Logger, UnauthorizedException } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "../middleware/request_context";
import { DatabaseException } from "../exception/database.exception";
import { sortedUniq } from "lodash";
import { decrypt } from "@app/core/auth/encryption";
import { UserCredentialDbRepository } from "@app/feature/identity-access/repositories/db/user-credential.repository";
import { UserCredentialRepository } from "@app/feature/identity-access/repositories/user-credential.repository";

export class TokenIntegrityValidator {
	constructor(
		@Inject(UserCredentialDbRepository)
		private userCredentialRepository: UserCredentialRepository,
		private readonly als: AsyncLocalStorage<RequestContext>
	) {}
	async validateToken(decodedToken: any) {
		try {
			const { version } =
				await this.userCredentialRepository.findUserByIdWithKeyspace(
					decodedToken["sub"],
					decodedToken["schema"],
					decodedToken["clientCode"]
				);
			if (version !== decodedToken["version"]) {
				throw new UnauthorizedException();
			}
		} catch (err) {
			if (err instanceof UnauthorizedException) {
				throw new UnauthorizedException();
			}
			throw new DatabaseException("Database connection error");
		}
	}
}
