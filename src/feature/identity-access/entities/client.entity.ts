import { DbEntity } from "@app/core/repository/entity";
import {
    PrimaryTextColumn,
    TextColumn,
} from "@app/shared/entities/entities.decorator";
import { Entity } from "typeorm";

@Entity({ name: "cms_client" })
export class Client implements DbEntity {

    @PrimaryTextColumn({ name: "client_code" })
    clientCode: string;

    @TextColumn({ name: "client_name" })
    clientName: string;

    static getTableName() {
        return "cms_client";
    }

    getTableName?(): string {
        return Client.getTableName();
    }
}