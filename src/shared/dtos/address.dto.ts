import {
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    ValidateIf
} from "class-validator";
import { LabelValuePair } from "../entities/label-value-pair.view";

export class AddressDto{
    @IsNotEmpty()
    @IsString()
    country: string | LabelValuePair;

    @IsNotEmpty()
    state:string | LabelValuePair;
    
    @IsNotEmpty()
    district:string | LabelValuePair;
    
    @IsNotEmpty()
    municipality:string | LabelValuePair;
 
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(4)
    // @Matches(/^[1-9]\d*$/, {
    //     message: "Invalid ward number",
    // })
    ward:string;
    
    @ValidateIf((field) => field.streetName.length)
    @IsString({ message: "Street name must be string" })
    @MinLength(2, { message: "Street name min length must be 2" })
    @MaxLength(50, { message: "Street name max length must be 50 characters" })
    streetName?: string;
    
}