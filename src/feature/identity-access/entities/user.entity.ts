import { DbEntity } from "CMS-BACK-END/src/core/repository/entity";
import {
	BooleanColumn,
	JsonbColumn,
	PrimaryTextColumn,
	TextColumn,
} from "CMS-BACK-END/src/shared/entities/entities.decorator";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";
import { Column, Entity } from "typeorm";

@Entity({ name: "bankportal_iam_user" })
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
	branch: SelectMenu;

	@JsonbColumn()
	roles: SelectMenu[];

	@JsonbColumn()
	createdBy: LabelValuePair;

	@TextColumn()
	createdOn: string;

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
		return "bankportal_iam_user";
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
@Entity({ name: "users_by_role" })
export class UserByRole {
	@PrimaryTextColumn("role_id")
	roleId: string;
	@PrimaryTextColumn("user_id")
	userId: string;
}