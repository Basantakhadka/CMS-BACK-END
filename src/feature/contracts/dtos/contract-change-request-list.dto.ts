export class ContractChangeRequestListItemDto {
    id: string;
    contractId?: string;
    changeType: string;
    status: string;
    requestedBy: string;
    requestedAt: string;
    remarks?: string;
    oldValue?: any;
    newValue?: any;
}
