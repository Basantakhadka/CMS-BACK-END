import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";

export function toLabelValuePair(data: string): LabelValuePair { 
    if (data === null || data === undefined || data === "") {
        return new LabelValuePair("","");
    }

    try {
        const parsedData = JSON.parse(data);
        return parsedData;
    } catch (error) {
        return new LabelValuePair("", "");
    }
}

export function fromLabelValuePair(data: LabelValuePair): string {
    if (data === null || data === undefined) {
        return JSON.stringify(new LabelValuePair("",""));
    }

    try {
        const parsedData = JSON.stringify(data);
        return parsedData;
    } catch (error) {
        return JSON.stringify(new LabelValuePair("", ""));
    }
}