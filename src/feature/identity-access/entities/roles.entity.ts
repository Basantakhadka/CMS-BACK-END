import { DbEntity } from "@app/core/repository/entity";
import {
	BooleanColumn,
	JsonbColumn,
	PrimaryTextColumn,
	TextColumn,
} from "@app/shared/entities/entities.decorator";
import { LabelValuePair } from "@app/shared/entities/label-value-pair.view";
import { types } from "cassandra-driver/lib/types";
import { Entity } from "typeorm";

@Entity({ name: "cms_identity_access_roles" })
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
		return "cms_identity_access_roles";
	}
}

