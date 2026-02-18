// create-contract-alert.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateContractAlertDto {
  @IsString()
  @IsNotEmpty()
  contractId: string; // Related Contract ID

  @IsBoolean()
  @IsOptional()
  triggerExpiry?: boolean = false; // Default to false if not provided

  @IsBoolean()
  @IsOptional()
  enableCustom?: boolean = false; // Default to false

  @IsOptional()
  @IsString()
  reminderInterval?: string; // Optional interval in days for custom reminders

  @IsOptional()
  @IsArray()
  communicationChannels?: string[]; // e.g., ["email", "sms"]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stakeholders?: string[]; // List of stakeholder IDs or emails
}
