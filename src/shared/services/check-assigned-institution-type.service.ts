import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CheckAssignedInstitutionTypeService {
    checkAssignedInstitutionType(requestContext: RequestContext, institutionType: string): boolean {
        const assignedInstiutionType: string[] = requestContext.getCurrentUser().institutionType;
        return assignedInstiutionType.includes(institutionType);
    }
}