import { BaseRepository } from "@app/core/repository/base.repository";
import { UserCredential } from "../entities/user-credential.entity";

export interface UserCredentialRepository
	extends BaseRepository<UserCredential, string> {
	findUserByIdWithKeyspace(id: string, keyspace: string, clientCode?: string): Promise<UserCredential>;
}
