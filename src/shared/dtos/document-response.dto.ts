import { getDownloadableUrlWithMIMEInterface } from 'CMS-BACK-END/src/core/minio/minio_client';

export class DocumentResponse {
    minioUrl: getDownloadableUrlWithMIMEInterface = {url: '', contentType: ''};
    objectId: string = "";
}
export class AdditionalCompanyDocumentResponse extends DocumentResponse {
    description: string = "";
}