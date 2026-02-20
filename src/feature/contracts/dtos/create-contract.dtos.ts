// create-contract.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray, IsDateString, IsNumber } from 'class-validator';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  parties: string[];

  // @IsDateString()
  @IsNotEmpty()
  expiryDate: string; // Stored as ISO date string

  @IsNotEmpty()
  contractDate: string; 

  @IsString()
  @IsNotEmpty()
  documentLink: string;

  @IsOptional()
  // @IsNumber({ maxDecimalPlaces: 2 })
  contractValue?: number;

  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @IsOptional()
  @IsString()
  renewalTerms?: string;

  @IsOptional()
  @IsString()
  governingLaw?: string;
}
