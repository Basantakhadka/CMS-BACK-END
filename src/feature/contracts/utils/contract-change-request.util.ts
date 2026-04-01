import { Contract } from "../entities/contracts.entity";
import { AddContractUsecaseRequest } from "../usecase/request/add-contract.usecase.request";
import { UpdateContractUsecaseRequest } from "../usecase/request/update-contract.usecase.request";

export type ContractSnapshot = Partial<Contract> & Record<string, any>;

export const sanitizeContractEntity = (contract?: Contract | null): ContractSnapshot | null => {
    if (!contract) {
        return null;
    }

    const {
        id,
        contract_title,
        contract_type,
        parties,
        expiry_date,
        contract_date,
        document_link,
        contract_value,
        jurisdiction,
        renewal_terms,
        governing_law,
        scope_of_work,
        amendment_date,
        amendment_link,
        termination_notice_days,
        client_code,
        deleted,
        created_at,
        updated_at,
    } = contract;

    return {
        id,
        contract_title,
        contract_type,
        parties,
        expiry_date,
        contract_date,
        document_link,
        contract_value,
        jurisdiction,
        renewal_terms,
        governing_law,
        scope_of_work,
        amendment_date,
        amendment_link,
        termination_notice_days,
        client_code,
        deleted,
        created_at,
        updated_at,
    } as ContractSnapshot;
};

export const buildCreateSnapshot = (
    request: AddContractUsecaseRequest,
    clientCode: string,
): ContractSnapshot => ({
    contract_title: request.title,
    contract_type: request.type,
    parties: request.parties,
    expiry_date: request.expiryDate,
    contract_date: request.contractDate,
    document_link: request.documentLink,
    contract_value: request.contractValue,
    jurisdiction: request.jurisdiction,
    renewal_terms: request.renewalTerms,
    governing_law: request.governingLaw,
    scope_of_work: request.scopeOfWork,
    amendment_date: request.amendmentDate,
    amendment_link: request.amendmentLink,
    termination_notice_days: request.terminationNoticeDays,
    client_code: clientCode,
    deleted: false,
});

export const buildUpdateSnapshot = (
    request: UpdateContractUsecaseRequest,
    existing: Contract,
    clientCode: string,
): ContractSnapshot => ({
    ...sanitizeContractEntity(existing),
    contract_title: request.title ?? existing.contract_title,
    contract_type: request.type ?? existing.contract_type,
    parties: request.parties ?? existing.parties,
    expiry_date: request.expiryDate ?? existing.expiry_date,
    contract_date: request.contractDate ?? existing.contract_date,
    document_link: request.documentLink ?? existing.document_link,
    contract_value: request.contractValue ?? existing.contract_value,
    jurisdiction: request.jurisdiction ?? existing.jurisdiction,
    renewal_terms: request.renewalTerms ?? existing.renewal_terms,
    governing_law: request.governingLaw ?? existing.governing_law,
    scope_of_work: request.scopeOfWork ?? existing.scope_of_work,
    amendment_date: request.amendmentDate ?? existing.amendment_date,
    amendment_link: request.amendmentLink ?? existing.amendment_link,
    termination_notice_days: request.terminationNoticeDays ?? existing.termination_notice_days,
    client_code: clientCode,
});

export const hydrateContractEntityFromSnapshot = (
    snapshot: ContractSnapshot,
    contractId?: string,
): Contract => {
    if (!snapshot.contract_title || !snapshot.contract_type || !snapshot.parties || !snapshot.contract_date || !snapshot.document_link || !snapshot.client_code) {
        throw new Error("Incomplete contract snapshot. Unable to hydrate contract entity.");
    }

    const contract = new Contract();
    contract.id = contractId ?? (snapshot.id as string);
    contract.contract_title = snapshot.contract_title;
    contract.contract_type = snapshot.contract_type;
    contract.parties = snapshot.parties;
    contract.expiry_date = snapshot.expiry_date;
    contract.contract_date = snapshot.contract_date;
    contract.document_link = snapshot.document_link;
    contract.contract_value = snapshot.contract_value;
    contract.jurisdiction = snapshot.jurisdiction;
    contract.renewal_terms = snapshot.renewal_terms;
    contract.governing_law = snapshot.governing_law;
    contract.scope_of_work = snapshot.scope_of_work;
    contract.amendment_date = snapshot.amendment_date;
    contract.amendment_link = snapshot.amendment_link;
    contract.termination_notice_days = snapshot.termination_notice_days;
    contract.client_code = snapshot.client_code;
    contract.deleted = snapshot.deleted ?? false;
    contract.created_at = snapshot.created_at ?? new Date();
    contract.updated_at = new Date();
    return contract;
};
