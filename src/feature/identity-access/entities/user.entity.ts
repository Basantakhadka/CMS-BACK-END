import { DbEntity } from "@app/core/repository/entity";
import {
	BooleanColumn,
	JsonbColumn,
	PrimaryTextColumn,
	TextColumn,
} from "@app/shared/entities/entities.decorator";
import { LabelValuePair } from "@app/shared/entities/label-value-pair.view";
import { SelectMenu } from "@app/shared/utils/get-items-for-select-menu.usecase.response";
import { Column, Entity } from "typeorm";

@Entity({ name: "cms_iam_user" })
export class User implements DbEntity {
	@PrimaryTextColumn()
	id: string;

	@TextColumn()
	userName: string;

	@TextColumn()
	userId: string;

	@TextColumn()
	employeeId: string;

	@JsonbColumn()
	roles: any[];

	@JsonbColumn()
	createdBy: LabelValuePair;

	@TextColumn()
	createdOn: any;

	@JsonbColumn()
	lastModifiedBy: LabelValuePair;

	@TextColumn()
	lastModifiedOn: string;

	@BooleanColumn()
	deleted: boolean;

	@JsonbColumn()
	deletedBy: LabelValuePair;

	@TextColumn()
	deletedOn: string;

	@BooleanColumn()
	active: boolean;

	@TextColumn()
	userType: string;

	static getTableName() {
		return "cms_iam_user";
	}
	getColumns?(): Map<string, string> {
		let map = new Map();
		map.set("userId", "user_id");
		map.set("userName", "user_name");
		return map;
	}
	getClusterColumns?(): string[] {
		throw new Error("Method not implemented.");
	}
}
@Entity({ name: "cms_users_by_role" })
export class UserByRole {
	@PrimaryTextColumn("role_id")
	roleId: any;
	@PrimaryTextColumn("user_id")
	userId: string;
}