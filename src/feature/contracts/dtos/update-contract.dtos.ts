// update-contract.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateContractDto {

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parties?: string[];

  @IsOptional()
  @IsString()
  expiryDate?: string; // ISO date string

  @IsOptional()
  @IsString()
  contractDate?: string;

  @IsOptional()
  @IsString()
  documentLink?: string;

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
