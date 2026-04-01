export class ContractChangeRequestDetailDto {
    id: string;
    contractId?: string;
    changeType: string;
    status: string;
    requestedBy: string;
    requestedAt: string;
    approvedBy?: string;
    approvedAt?: string;
    remarks?: string;
    oldData?: Record<string, any> | null;
    newData?: Record<string, any> | null;
}
