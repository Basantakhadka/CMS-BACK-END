// usecase/request/add-contract-alert.usecase.request.ts
export class AddContractAlertUsecaseRequest {
    constructor(
        public readonly contractId: string,
        public readonly triggerExpiry?: boolean,
        public readonly enableCustom?: boolean,
        public readonly reminderInterval?: string,
        public readonly communicationChannels?: string[],
        public readonly stakeholders?: string,
    ) {}
}
