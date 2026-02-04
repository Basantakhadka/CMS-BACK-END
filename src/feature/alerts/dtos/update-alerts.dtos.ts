// update-contract-alert.dto.ts
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class UpdateContractAlertDto {

  @IsOptional()
  @IsBoolean()
  triggerExpiry?: boolean;

  @IsOptional()
  @IsBoolean()
  enableCustom?: boolean;

  @IsOptional()
  @IsNumber()
  reminderInterval?: number; // Interval in days for custom reminders

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  communicationChannels?: string[]; // e.g., ["email", "sms"]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stakeholders?: string[]; // List of stakeholder IDs or emails

  @IsOptional()
  @IsBoolean()
  deleted?: boolean; // For soft delete
}
