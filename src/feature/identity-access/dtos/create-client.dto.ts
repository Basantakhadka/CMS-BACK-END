import { Transform } from "class-transformer";
import { IsNotEmpty, Matches, MaxLength } from "class-validator";

export class CreateClientDto {
    @IsNotEmpty()
    clientCode: string;

    @IsNotEmpty()
    @MaxLength(80)
    clientName: string;
}
