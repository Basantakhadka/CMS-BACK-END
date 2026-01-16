import { Result } from "@app/feature/common/result";
import { BadRequestException } from "@nestjs/common";

export function decodePaginationToken(token:string) {
    const regex = /UID-(.+)-TS-(\d+-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}.\d+)/;
    const match = token?.match(regex);
    
    if (!match || match.length !== 3) {
        Result.createErrorWithMessage(new BadRequestException("Pagination Token invalid"), "Pagination Token invalid");
    }

    const uid = match[1];
    const timestamp = match[2];
    
    return { uid, timestamp };
}

export function encodePaginationToken(id: string, timestamp: Date | string) {
    return `UID-${ id }-TS-${ timestamp }`;
}