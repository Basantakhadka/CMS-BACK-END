import {EnumType} from "./enum-type.constant";
import {LabelValuePair} from "CMS-BACK-END/src/shared/entities/label-value-pair.view";

/**
 * Enum representing different discount status constants.
 */
export class DiscountStatusConstant extends EnumType<DiscountStatusConstant> {
    /**
     * Represents a successful discount status.
     */
    public static readonly SUCCESS = new DiscountStatusConstant("SUCCESS", "Success", "00");
    /**
     * Represents a processing discount status.
     */
    public static readonly PROCESSING = new DiscountStatusConstant("PROCESSING", "Processing", "LO");
    /**
     * Represents a failed discount status.
     */
    public static readonly FAILED = new DiscountStatusConstant("FAILED", "Failed", "05");

    /**
     * Creates an instance of DiscountStatusConstant.
     * @param name The name of the discount status.
     * @param displayName The display name of the discount status.
     * @param statusCode The status code of the discount status.
     */
    constructor(
        public readonly name: string,
        public readonly displayName: string,
        public readonly statusCode: string
    ) {
        super(name);
        this.displayName = displayName;
        this.statusCode = statusCode;
    }

    /**
     * Retrieves all values of the DiscountStatusConstant enum.
     * @returns An array of DiscountStatusConstant objects.
     */
    public static getValues(): DiscountStatusConstant[] {
        return [
            this.SUCCESS,
            this.PROCESSING,
            this.FAILED
        ];
    }

    /**
     * Retrieves a DiscountStatusConstant object by its name.
     * @param name The name of the discount status.
     * @returns The DiscountStatusConstant object if found, otherwise null.
     */
    public static getByName(name: string): DiscountStatusConstant {
        let results = this.getValues().filter((item) => item.name === name);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }

    /**
     * Retrieves a DiscountStatusConstant object by its status code.
     * @param statusCode The status code of the discount status.
     * @returns The DiscountStatusConstant object if found, otherwise null.
     */
    public static getByStatusCode(statusCode: string):DiscountStatusConstant{
        let results = this.getValues().filter((item) => item.statusCode === statusCode);
        if (results && results.length > 0) {
            return results[0];
        }
        return null;
    }

    /**
     * Retrieves status codes of all discount statuses as an array of LabelValuePair objects.
     * @returns An array of LabelValuePair objects representing status codes and their display names.
     */
    public static getStatusCodeInLabelValuePair(): LabelValuePair[] {
        const result = this.getValues().map(item => {
            return new LabelValuePair(item.displayName, item.statusCode);
        })

        return result;
    }

    /**
     * Retrieves status codes of successful and failed discount statuses as an array of LabelValuePair objects.
     * @returns An array of LabelValuePair objects representing status codes and their display names.
     */
    public static getSuccessAndFailedStatusCodeInLabelValuePair(): LabelValuePair[] {
        return [
            new LabelValuePair(this.SUCCESS.displayName, this.SUCCESS.statusCode),
            new LabelValuePair(this.FAILED.displayName, this.FAILED.statusCode)
        ];
    }
}