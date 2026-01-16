import { LabelValuePair } from "../entities/label-value-pair.view";
export class AddressResponseDto {
    country: LabelValuePair = new LabelValuePair("", "");
    state: LabelValuePair = new LabelValuePair("", "");
    district: LabelValuePair = new LabelValuePair("", "");
    municipality: LabelValuePair = new LabelValuePair("", "");
    ward?: string = "";
    streetName?: string = "";
}