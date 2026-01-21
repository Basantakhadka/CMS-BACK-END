export class Filter {
	public field: string;
	public condition: FilterCondition | string;
	public values: Array<string | number | boolean>;
	public dataType?: string;

	constructor(
		field: string,
		condition: FilterCondition | string,
		values: Array<string | number | boolean>,
		dataType?: string
	) {
		this.field = field;
		this.condition = condition;
		this.values = values;
		this.dataType = dataType;
	}
	public getField?(): string {
		return this.field;
	}
	public getCondition?(): FilterCondition | string {
		return this.condition;
	}
	public getValues?(): Array<string | number | boolean> {
		return this.values;
	}

	public getConditionString?(): string {
		return this.condition.toString();
	}
}
   export enum FilterCondition {
     exact,
     equals,
     contains,
     contains_any,
     between,
     less_than,
     greater_than,
     less_than_or_equals,
     greater_than_or_equals,
     not_contains_any,
     not_contains,
     not_equals,
     in
   }
   
   
