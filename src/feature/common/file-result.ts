export class FileResult {
    contentType: string;
    fileName: string;
    buffer: Buffer;

    constructor (contentType: string, fileName: string, buffer: Buffer) {
        this.contentType = contentType;
        this.fileName = fileName;
        this.buffer = buffer;
    }

}
