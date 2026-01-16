import { EnumType } from "./enum-type.constant";

export class DetailTransactionStatus extends EnumType<DetailTransactionStatus> {
	public static readonly SALE_INITIATED = new DetailTransactionStatus(
		"SALE_INITIATED",
		"Sale Initiated"
	);
	public static readonly SALE_COMPLETED = new DetailTransactionStatus(
		"SALE_COMPLETED",
		"Sale Completed"
	);
	public static readonly VOID_INITIATED = new DetailTransactionStatus(
		"VOID_INITIATED",
		"Void Initiated"
	);
	public static readonly VOID_COMPLETED = new DetailTransactionStatus(
		"VOID_COMPLETED",
		"Void Completed"
	);
	public static readonly REFUND_INITIATED = new DetailTransactionStatus(
		"Refund_INITIATED",
		"Refund Initiated"
	);
	public static readonly REFUND_COMPLETED = new DetailTransactionStatus(
		"REFUND_COMPLETED",
		"Refund Completed"
	);

	constructor(
		public readonly name: string,
		public readonly displayname: string
	) {
		super(name);
		this.displayname = displayname;
	}

	public static getValues(): DetailTransactionStatus[] {
		return [this.SALE_INITIATED, this.SALE_COMPLETED, this.VOID_INITIATED,this.VOID_COMPLETED,this.REFUND_INITIATED,this.REFUND_COMPLETED];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
	public static getNames(): Array<string> {
		let response: Array<string> = [];
		let results = this.getValues().map((type) => {
			response.push(type.name);
		});
		return response;
	}

	public static getLabelListOfTransactionType(
		transactionType: string[]
	): string[] {
		const result: string[] = transactionType.map((mode) => {
			return this.getByName(mode).displayname;
		});

		return result;
	}
}
