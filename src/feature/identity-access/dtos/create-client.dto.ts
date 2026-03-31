import { Transform } from "class-transformer";
import { IsNotEmpty, Matches, MaxLength } from "class-validator";

export class CreateClientDto {
    @IsNotEmpty()
    @Matches(/^\d{4}$/)
    @Transform(({ value }) => value?.toString()?.trim())
    clientCode: string;

    @IsNotEmpty()
    @MaxLength(80)
    clientName: string;
}
