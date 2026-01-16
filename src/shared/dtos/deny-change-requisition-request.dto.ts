import { IsNotEmpty, IsString } from "class-validator";

export class DenyChangeRequisitionRequestDto{
    
    @IsNotEmpty()
    @IsString()
    denialReason: string;
}