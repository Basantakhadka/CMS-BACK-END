import { SystemsConstant } from "CMS-BACK-END/src/core/constants/systems.constant";
import {
	PrimaryTextColumn,
	TextColumn,
} from "CMS-BACK-END/src/shared/entities/entities.decorator";
import { Entity } from "typeorm";

@Entity({ name: "bank_branches", schema: SystemsConstant.SHARED_KEYSPACE })
export class BankBranch {
	@PrimaryTextColumn()
	id: string;
	@TextColumn()
	name: string;
	getColumns?(): Map<string, string> {
		throw new Error("Method not implemented.");
	}
	getClusterColumns?(): string[] {
		throw new Error("Method not implemented.");
	}
}
