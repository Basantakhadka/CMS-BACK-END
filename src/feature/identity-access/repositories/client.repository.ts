import { BaseRepository } from "@app/core/repository/base.repository";
import { Client } from "../entities/client.entity";

export interface ClientRepository extends BaseRepository<Client, string> {
    findByCode(clientCode: string): Promise<Client>;
}
