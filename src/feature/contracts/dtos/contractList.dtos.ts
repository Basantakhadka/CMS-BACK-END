export class GetContractListResponseDto {
    id: string;                // Contract ID
    title: string;     // Contract Title
    type: string;      // Contract Type
    parties: any[];            // Parties involved (JSON array)
    expiryDate: string;   
    contractDate: string;     // Contract Date (ISO string)
    documentLink: string;      // Document link
    contractValue?: number;    // Optional Contract value
    jurisdiction?: string;     // Optional Jurisdiction
    renewalTerms?: string;     // Optional Renewal terms
    governingLaw: string;      // Governing law        // Active / Deleted
    createdAt: any;         // Creation timestamp (ISO string)
    updatedAt: any;         // Last update timestamp (ISO string)
}