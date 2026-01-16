import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsDateString,
    IsOptional,
    IsNumber,
    MaxLength,
    IsObject,
} from 'class-validator';
import { ContractType, ContractStatus } from '../entities/contract.entity';

export class CreateContractDto {
    @ApiProperty({ description: 'Contract title', example: 'Software Development Agreement' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @ApiPropertyOptional({ description: 'Contract description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Unique contract number', example: 'CNT-2026-001' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    contractNumber: string;

    @ApiProperty({ enum: ContractType, description: 'Type of contract' })
    @IsEnum(ContractType)
    contractType: ContractType;

    @ApiPropertyOptional({ enum: ContractStatus, description: 'Contract status', default: ContractStatus.DRAFT })
    @IsEnum(ContractStatus)
    @IsOptional()
    status?: ContractStatus;

    @ApiProperty({ description: 'First party name', example: 'Company A Ltd.' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    partyA: string;

    @ApiProperty({ description: 'Second party name', example: 'Company B Inc.' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    partyB: string;

    @ApiProperty({ description: 'Contract start date', example: '2026-01-01' })
    @IsDateString()
    startDate: Date;

    @ApiProperty({ description: 'Contract end date', example: '2027-01-01' })
    @IsDateString()
    endDate: Date;

    @ApiPropertyOptional({ description: 'Contract value', example: 100000.00 })
    @IsNumber()
    @IsOptional()
    value?: number;

    @ApiPropertyOptional({ description: 'Currency code', example: 'USD' })
    @IsString()
    @IsOptional()
    @MaxLength(10)
    currency?: string;

    @ApiPropertyOptional({ description: 'Contract terms and conditions' })
    @IsString()
    @IsOptional()
    terms?: string;

    @ApiPropertyOptional({ description: 'Additional metadata' })
    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;
}
