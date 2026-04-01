export enum ContractChangeRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum ContractChangeRequestType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
}

export const CONTRACT_CHANGE_REQUEST_TABLE = "cms_contracts_change_request";
