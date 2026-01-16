import { LabelValuePair } from "../entities/label-value-pair.view";
import { EnumType } from "./enum-type.constant";

export class FundTransferStatusConstant extends EnumType<FundTransferStatusConstant>{
    public static readonly FUND_TRANSFER_FAILED = new FundTransferStatusConstant('FUND_TRANSFER_FAILED', 'Fund transfer failed');
    public static readonly PROCESSING = new FundTransferStatusConstant('PROCESSING', 'Processing');
    public static readonly SUCCESS = new FundTransferStatusConstant('SUCCESS', 'Success');
    public static readonly FAILED = new FundTransferStatusConstant('FAILED', 'Failed');
    public static readonly VALIDATION_FAILED = new FundTransferStatusConstant('VALIDATION_FAILED', 'Validation failed');
    public static readonly IN_PROGRESS = new FundTransferStatusConstant('IN_PROGRESS', 'In progress');
    public static readonly REQUESTED = new FundTransferStatusConstant('REQUESTED', 'Requested');
    public static readonly REPROCESSED = new FundTransferStatusConstant('REPROCESSED', 'Reprocessed');
    public static readonly PENDING = new FundTransferStatusConstant('PENDING', 'Pending');

    constructor (public readonly name: string, public readonly displayname: string) {
        super(name);
        this.displayname = displayname;
    }

    public static getValues(): FundTransferStatusConstant[] {
        return [
            this.FUND_TRANSFER_FAILED,
            this.PROCESSING,
            this.SUCCESS,
            this.FAILED,
            this.VALIDATION_FAILED,
            this.IN_PROGRESS,
            this.REQUESTED,
            this.REPROCESSED,
            this.PENDING
        ]
    }
    public static getByName(name: string) {
        let results = this.getValues().filter(item => item.name === name);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }
    public static getNames(): Array<string> {
        const transactionStatus = [];
        this.getValues().map(txnStatus => {
            transactionStatus.push(txnStatus.name);
        })
        return transactionStatus;
    }

    public static getByLabelValuePair(): LabelValuePair[] {
        const result = this.getValues().map(item => {
            return new LabelValuePair(item.displayname, item.name);
        })

        return result;
    }
}