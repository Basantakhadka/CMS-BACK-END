export class GetContractAlertResponseDto {
    id: string;                       // Alert ID
    contractId: string;                // Related Contract ID
    triggerExpiry: boolean;            // True if expiry alert is enabled
    enableCustom: boolean;             // True if custom reminder is enabled
    reminderInterval?: string;         // Optional interval for custom reminders (days)
    communicationChannels?: any;       // JSON: e.g., ["email", "sms"]
    stakeholders?: any;                // JSON: list of stakeholders to notify
    createdAt: any;                    // Creation timestamp (ISO string)
    updatedAt: any;                    // Last update timestamp (ISO string)              
}
