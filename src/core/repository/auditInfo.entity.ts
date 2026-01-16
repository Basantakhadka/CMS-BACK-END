import { BooleanColumn, JsonbColumn, TextColumn, TimestampColumn } from "CMS-BACK-END/src/shared/entities/entities.decorator";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { BaseEntity } from "typeorm";

export abstract class AuditInfo extends BaseEntity{ 

    /**
     * Created by
     */
    @JsonbColumn()
    createdBy: LabelValuePair;

    /**
     * Created on
     */
    @TimestampColumn()
    createdOn: Date | string;
    
    /**
     * Last modified by
     */
    @JsonbColumn()
    lastModifiedBy: LabelValuePair; 

    /**
     * Last modified on
     */
    @TimestampColumn()
    lastModifiedOn: Date | string;

    /**
     * Is deleted
     */
    @BooleanColumn({default: false, nullable: false})
    isDeleted: boolean;
}