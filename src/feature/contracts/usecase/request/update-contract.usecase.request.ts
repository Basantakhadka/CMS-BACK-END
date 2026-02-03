import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class UpdateContractUsecaseRequest implements UsecaseRequest {
  constructor(
    public id: string,                 // TEXT primary key
    public title?: string,
    public type?: string,
    public parties?: string[],
    public expiryDate?: string,         // ISO string
    public documentLink?: string,
    public contractValue?: number,
    public jurisdiction?: string,
    public renewalTerms?: string,
    public governingLaw?: string
  ) {}
}
