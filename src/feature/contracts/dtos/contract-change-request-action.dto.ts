import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ContractChangeRequestActionDto {
    @IsOptional()
    @IsString()
    remarks?: string;
}

export class RejectContractChangeRequestDto {
    @IsString()
    @IsNotEmpty()
    remarks: string;
}
