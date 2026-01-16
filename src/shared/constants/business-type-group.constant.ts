import { EnumType } from "./enum-type.constant";

export class BusinessTypeGroupConstant extends EnumType<BusinessTypeGroupConstant> {
	public static readonly REGISTERED = new BusinessTypeGroupConstant(
		"REGISTERED",
		"Registered",
		true
	);
	public static readonly UNREGISTERED = new BusinessTypeGroupConstant(
		"UNREGISTERED",
		"Unregistered",
		false
	);

	constructor(
		public readonly name: string,
		public readonly displayName: string,
		public readonly booleanValue: boolean
	) {
		super(name);
		this.displayName = displayName;
	}
	public static getValues(): BusinessTypeGroupConstant[] {
        return [
            this.REGISTERED,
            this.UNREGISTERED
        ];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
}
