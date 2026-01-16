import { EnumType } from "./enum-type.constant";

export class TransactionStatusSummary extends EnumType<TransactionStatusSummary> {
	public static readonly SALE = new TransactionStatusSummary("SALE", "Sale");
	public static readonly VOID = new TransactionStatusSummary("VOID", "Void");
	public static readonly REFUND = new TransactionStatusSummary(
		"REFUND",
		"Refund"
	);
	public static readonly DECLINED = new TransactionStatusSummary(
		"DECLINED",
		"Declined"
	);
	public static readonly FAILED = new TransactionStatusSummary("FAILED", "Failed");

	constructor(
		public readonly name: string,
		public readonly displayname: string
	) {
		super(name);
		this.displayname = displayname;
	}

	public static getValues(): TransactionStatusSummary[] {
		return [this.SALE, this.VOID, this.REFUND, this.DECLINED, this.FAILED];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
	public static getNames() {
		const TransactionStatusSummarys = [];
		this.getValues().map((txnType) => {
			TransactionStatusSummarys.push(txnType.name);
		});
		return TransactionStatusSummarys;
	}

	public static getNameListOfTxnTypes(txnTypes: string[]): string[] {
		const result: string[] = txnTypes.map((txn) => {
			return this.getByName(txn).displayname;
		});

		return result;
	}
}
