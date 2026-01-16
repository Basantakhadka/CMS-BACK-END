import { IsNotEmpty, IsString } from "class-validator";

export class GetOneUserChangeRequestDto{
    @IsNotEmpty()
    @IsString()
    refId:string;
}