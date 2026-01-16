import { DbEntity } from "CMS-BACK-END/src/core/repository/entity";
import { ChangeRequest } from "@app/shared/entities/change-request";
import {
	BooleanColumn,
	JsonbColumn,
	PrimaryTextColumn,
	TextColumn,
} from "CMS-BACK-END/src/shared/entities/entities.decorator";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { types } from "cassandra-driver/lib/types";
import { Entity } from "typeorm";

@Entity({ name: "bankportal_identity_access_roles" })
export class Role implements DbEntity {
	@PrimaryTextColumn()
	id: string;

	@TextColumn()
	title: string;

	@BooleanColumn()
	active: boolean;

	@TextColumn()
	createdOn: string;

	@JsonbColumn()
	createdBy: LabelValuePair;

	@TextColumn()
	lastModifiedOn: string;

	@JsonbColumn()
	lastModifiedBy: LabelValuePair;

	@JsonbColumn()
	permissions: string[];

	@BooleanColumn()
	deleted: boolean;

	@TextColumn()
	deletedOn: string;

	@JsonbColumn()
	deletedBy: LabelValuePair;
	static async mapper(data: types.ResultSet): Promise<Role[]> {
		const newData: Role[] = [];
		data.rows.map((item) => {
			const role = new Role();
			role.id = item.id;
			role.title = item.title;
			role.createdOn = item.created_on;
			role.lastModifiedOn = item.last_modified_on;
			role.active = item.active;
			role.permissions = item.permissions;
			role.lastModifiedBy = item.last_modified_by;
			role.createdBy = item.created_by;
			newData.push(role);
		});
		return newData;
	}

	static getColumns?(): Map<string, string> {
		let map = new Map();
		map.set("id", "id");
		map.set("permissions", "permissions");
		map.set("deleted", "deleted");
		map.set("active", "active");
		return map;
	}

	getClusterColumns?(): string[] {
		throw new Error("Method not implemented.");
	}

	static getColumnName(fieldName: string): string {
		return this.getColumns().get(fieldName);
	}

	static getTableName?(): string {
		return "bankportal_identity_access_roles";
	}
}
@Entity({ name: "bankportal_roles_change_request" })
export class RoleChangeRequest extends ChangeRequest {
	@TextColumn()
	title: string;
	@BooleanColumn()
	active: boolean;
	@JsonbColumn()
	permissions: Array<string>;
	@TextColumn()
	createdOn: string;
	@TextColumn()
	changeRequestStatus: string;

	static getTableName() {
		return "bankportal_roles_change_request";
	}

	static async mapper(data: types.ResultSet): Promise<RoleChangeRequest[]> {
		const newData: RoleChangeRequest[] = [];
		data.rows.forEach((item) => {
			const changeRequest = new RoleChangeRequest();
			changeRequest.id = item.id;
			changeRequest.title = item.title;
			changeRequest.active = item.active;
			changeRequest.permissions = item.permissions;
			changeRequest.refId = item.ref_id;
			changeRequest.requestedBy = item.requested_by;
			changeRequest.requestedOn = item.requested_on;
			changeRequest.status = item.status;
			changeRequest.type = item.type;
			changeRequest.createdOn = item.created_on;
			newData.push(changeRequest);
		});
		return newData;
	}
}
