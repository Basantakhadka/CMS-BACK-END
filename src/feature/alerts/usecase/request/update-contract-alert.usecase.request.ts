

// usecase/request/update-contract-alert.usecase.request.ts
export class UpdateContractAlertUsecaseRequest {
    constructor(
        public readonly id: string,
        public readonly triggerExpiry?: boolean,
        public readonly enableCustom?: boolean,
        public readonly reminderInterval?: string,
        public readonly communicationChannels?: string[],
        public readonly stakeholders?: string[],
        public readonly deleted?: boolean,
    ) {}
}
