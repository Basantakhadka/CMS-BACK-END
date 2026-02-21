    import { UsecaseRequest } from "@app/core/usecase/usecase.request";

    export class AddContractUsecaseRequest implements UsecaseRequest {
    constructor(
        public title: string,
        public type: string,
        public parties: string[],
        public expiryDate: string, // ISO string
        public contractDate: string,
        public documentLink: string,
        public contractValue: number,
        public jurisdiction: string,
        public renewalTerms: string,
        public governingLaw:string,
        public scopeOfWork?: string,
        public amendmentDate?: string,
        public amendmentLink?: string,
        public terminationNoticeDays?: string
    ) {}
    }
