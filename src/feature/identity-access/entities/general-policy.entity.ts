import { DbEntity } from "@app/core/repository/entity";
import {
	MultiFactorAuthentication,
	OTPSetting,
	PasswordPolicy,
} from "../dtos/create-general-policy.dto";
import { Entity } from "typeorm";
import {
	BooleanColumn,
	JsonbColumn,
	PrimaryTextColumn,
} from "@app/shared/entities/entities.decorator";
@Entity({ name: "general_policy_by_id" })
export class GeneralPolicy implements DbEntity {
	@PrimaryTextColumn()
	id: string;
	@BooleanColumn()
	active: boolean;
	@JsonbColumn()
	usersMfa: MultiFactorAuthentication;
	@JsonbColumn()
	merchantsMfa: MultiFactorAuthentication;
	@JsonbColumn()
	passwordPolicy: PasswordPolicy;
	@JsonbColumn()
	usersOtpSetting: OTPSetting;
	@JsonbColumn()
	merchantsOtpSetting: OTPSetting;
	@JsonbColumn()
	merchantSignupOtpSetting: OTPSetting;
	getColumns?(): Map<string, string> {
		throw new Error("Method not implemented.");
	}
	getClusterColumns?(): string[] {
		throw new Error("Method not implemented.");
	}
	static tableName() {
		return "general_policy_by_id";
	}
}
