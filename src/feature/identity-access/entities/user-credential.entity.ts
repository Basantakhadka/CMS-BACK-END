import { DbEntity } from "@app/core/repository/entity";
import {
	BooleanColumn,
	IntegerColumn,
	JsonbColumn,
	PrimaryTextColumn,
	TextColumn,
} from "@app/shared/entities/entities.decorator";
import { Entity } from "typeorm";

@Entity({ name: "cms_iam_user_credentials" })
export class UserCredential implements DbEntity {
	@PrimaryTextColumn()
	id: string;

	@TextColumn({ name: "client_code" })
	clientCode: string;

	@TextColumn()
	version: string;

	@TextColumn()
	password: string;

	@BooleanColumn()
	enforcePasswordChange: boolean;

	@TextColumn()
	expiryTime: string;

	@TextColumn()
	loginAttemptsTimer: string;

	@JsonbColumn()
	passwordHistory: string[];

	@IntegerColumn()
	unsuccessfulLoginAttempts: number;

	@BooleanColumn()
	blocked: boolean;

	getColumns?(): Map<string, string> {
		return new Map<string, string>();
	}

	getClusterColumns?(): string[] {
		return [];
	}
}
