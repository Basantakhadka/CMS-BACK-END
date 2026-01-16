import { DbEntity } from "CMS-BACK-END/src/core/repository/entity";
import { ChangeRequest } from "@app/shared/entities/change-request";
import {
	BooleanColumn,
	JsonbColumn,
	TextColumn,
} from "CMS-BACK-END/src/shared/entities/entities.decorator";
import { SelectMenu } from "CMS-BACK-END/src/shared/utils/get-items-for-select-menu.usecase.response";
import { Entity } from "typeorm";

@Entity({
	name: "bankportal_iam_user_change_request",
})
export class UserChangeRequest extends ChangeRequest implements DbEntity {
	@TextColumn()
	changeRequestStatus: string;

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

	@BooleanColumn()
	active: boolean;

	static getTableName() {
		return "bankportal_iam_user_change_request";
	}

	static async mapper(
		data: Map<string, object>[]
	): Promise<UserChangeRequest[]> {
		const newData: UserChangeRequest[] = [];
		data.forEach((item) => {
			const changeRequest = new UserChangeRequest();
			item.forEach((value: any, key: string) => {
				changeRequest[key] = value;
			});
			newData.push(changeRequest);
		});
		return newData;
	}
}