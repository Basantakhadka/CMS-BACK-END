
import { BaseRepository } from "../../../core/repository/base.repository"
import { UserCredential } from "../entities/user-credential.entity";

export interface UserCredentialRepository
	extends BaseRepository<UserCredential, string> {
	findUserByIdWithKeyspace(id: string, keyspace: string): Promise<UserCredential>;
}
