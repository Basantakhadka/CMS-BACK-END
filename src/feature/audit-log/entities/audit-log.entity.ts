import { DbEntity } from "@app/core/repository/entity";
import {
	BooleanColumn,
	JsonbColumn,
	PrimaryTextColumn,
	TextColumn,
	TimestampColumn,
} from "@app/shared/entities/entities.decorator";
import { Entity } from "typeorm";

export enum AuditAction {
	CREATE = "CREATE",
	UPDATE = "UPDATE",
	DELETE = "DELETE",
	LOGIN = "LOGIN",
	LOGOUT = "LOGOUT",
	VIEW = "VIEW",
}

@Entity({ name: "cms_audit_log" })
export class AuditLog implements DbEntity {
	@PrimaryTextColumn()
	id!: string;

	/** The IAM user ID who performed the action */
	@TextColumn()
	actorUserId!: string;

	/** Human-readable display name of the actor */
	@TextColumn()
	actorUserName!: string;

	/** Action performed: CREATE | UPDATE | DELETE | LOGIN | LOGOUT | VIEW */
	@TextColumn()
	action!: string;

	/** Resource / entity type affected, e.g. "User", "Role", "Client" */
	@TextColumn()
	resourceType!: string;

	/** Primary key of the affected resource */
	@TextColumn()
	resourceId!: string;

	/** Optional human-readable label for the resource */
	@TextColumn()
	resourceLabel?: string | null;

	/** Snapshot of the payload before the change */
	@JsonbColumn()
	previousValue?: Record<string, any> | null;

	/** Snapshot of the payload after the change */
	@JsonbColumn()
	newValue?: Record<string, any> | null;

	/** HTTP method, endpoint, IP, etc. */
	@JsonbColumn()
	metadata?: Record<string, any> | null;

	/** Whether the action was successful */
	@BooleanColumn()
	success!: boolean;

	/** Error message when success = false */
	@TextColumn()
	errorMessage?: string | null;

	/** ISO timestamp of when the event occurred */
	@TimestampColumn()
	performedAt!: Date;

	/** Schema / tenant that this log belongs to */
	@TextColumn({ name: "client_code" })
	clientCode?: string | null;

	static getTableName() {
		return "cms_audit_log";
	}

	getColumns?(): Map<string, string> {
		const map = new Map<string, string>();
		map.set("actorUserId", "actor_user_id");
		map.set("actorUserName", "actor_user_name");
		map.set("resourceType", "resource_type");
		map.set("resourceId", "resource_id");
		map.set("resourceLabel", "resource_label");
		map.set("previousValue", "previous_value");
		map.set("newValue", "new_value");
		map.set("errorMessage", "error_message");
		map.set("performedAt", "performed_at");
		map.set("clientCode", "client_code");
		return map;
	}
}
