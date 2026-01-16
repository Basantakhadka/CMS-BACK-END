import { IsNotEmpty, IsString } from "class-validator";

export class RevertChangeRequestDto{

    @IsNotEmpty()
    @IsString()
    comments: string;
}