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
  @IsString()
  reminderInterval?: string; // Interval in days for custom reminders

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  communicationChannels?: string[]; // e.g., ["email", "sms"]

  @IsOptional()
  @IsString()
  stakeholders?:string; // List of stakeholder IDs or emails

  @IsOptional()
  @IsBoolean()
  deleted?: boolean; // For soft delete
}
