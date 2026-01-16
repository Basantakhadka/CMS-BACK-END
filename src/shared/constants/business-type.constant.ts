import { BusinessTypeGroupConstant } from "./business-type-group.constant";
import { EnumType } from "./enum-type.constant";

export class BusinessTypeConstant extends EnumType<BusinessTypeConstant> {
	public static readonly INDIVIDUAL = new BusinessTypeConstant(
		"INDIVIDUAL",
		"Individual",
		BusinessTypeGroupConstant.UNREGISTERED.name
	);
	public static readonly SMALL_BUSINESS = new BusinessTypeConstant(
		"SMALL_BUSINESS",
		"Small Business",
		BusinessTypeGroupConstant.UNREGISTERED.name
	);
	public static readonly SOLE_PROPRIETORSHIP = new BusinessTypeConstant(
		"SOLE_PROPRIETORSHIP",
		"Sole Proprietorship",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	public static readonly PARTNERSHIP = new BusinessTypeConstant(
		"PARTNERSHIP",
		"Partnership",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	public static readonly PRIVATE_LIMITED = new BusinessTypeConstant(
		"PRIVATE_LIMITED",
		"Private Limited",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	public static readonly PUBLIC_LIMITED = new BusinessTypeConstant(
		"PUBLIC_LIMITED",
		"Public Limited",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	public static readonly NON_PROFIT_ORG = new BusinessTypeConstant(
		"NON_PROFIT_ORG",
		"Non-Profit Organization",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	public static readonly FAITH_BASED_ORG = new BusinessTypeConstant(
		"FAITH_BASED_ORG",
		"Faith Based Organization",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	public static readonly GOV_UNIT = new BusinessTypeConstant(
		"GOV_UNIT",
		"Government Unit",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	public static readonly NON_GOV_ORG = new BusinessTypeConstant(
		"NON_GOV_ORG",
		"Non-government Organization",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	public static readonly ORDINARY_PARTNERSHIP = new BusinessTypeConstant(
		"ORDINARY_PARTNERSHIP",
		"Ordinary Partnership",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	public static readonly NOT_DEFINED = new BusinessTypeConstant(
		"Not Defined",
		"Not Defined",
		BusinessTypeGroupConstant.REGISTERED.name
	);
	constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly groupName: string
	) {
		super(name);
		this.displayName = displayName;
		this.groupName = groupName;
	}
	public static getValues(): BusinessTypeConstant[] {
		return [
			this.INDIVIDUAL,
			this.SMALL_BUSINESS,
			this.SOLE_PROPRIETORSHIP,
			this.PARTNERSHIP,
			this.PRIVATE_LIMITED,
			this.PUBLIC_LIMITED,
			this.NON_PROFIT_ORG,
			this.FAITH_BASED_ORG,
			this.GOV_UNIT,
			this.NON_GOV_ORG,
			this.ORDINARY_PARTNERSHIP,
			this.NOT_DEFINED,
		];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}

	public static getGroupName(name: string) {
		return this.getByName(name)?.groupName;
	}

	public static isRegistered(name: string): boolean {
		if (name) {
			return BusinessTypeGroupConstant[
				`${BusinessTypeConstant[`${name}`]?.groupName}`
			]?.booleanValue;
		}
		return false;
	}
}