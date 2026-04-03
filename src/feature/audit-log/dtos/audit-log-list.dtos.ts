export class AuditLogResponseDto {
	id: string;
	actorUserId: string;
	actorUserName: string;
	action: string;
	resourceType: string;
	resourceId: string;
	resourceLabel?: string | null;
	previousValue?: Record<string, any> | null;
	newValue?: Record<string, any> | null;
	metadata?: Record<string, any> | null;
	success: boolean;
	errorMessage?: string | null;
	performedAt: string;
	clientCode?: string | null;
}

