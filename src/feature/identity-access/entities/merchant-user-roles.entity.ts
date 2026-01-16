import {Entity} from "typeorm";
import {DbEntity} from "CMS-BACK-END/src/core/repository/entity";
import {BooleanColumn, JsonbColumn, PrimaryTextColumn, TextColumn} from "CMS-BACK-END/src/shared/entities/entities.decorator";
import {SystemsConstant} from "CMS-BACK-END/src/core/constants/systems.constant";

/**
 * Represents an entity for merchant user roles.
 * @class
 * @name MerchantUserRolesEntity
 * @implements {DbEntity}
 */
@Entity({ name: "merchant_user_roles", schema: SystemsConstant.SHARED_KEYSPACE })
export class MerchantUserRolesEntity implements DbEntity {
    /** The unique identifier of the user role. */
    @PrimaryTextColumn()
    id: string;

    /** The title of the user role. */
    @TextColumn()
    title: string;

    /** Indicates whether the user role is active or not. */
    @BooleanColumn()
    isActive: boolean;

    /** Indicates whether the user role is deleted or not. */
    @BooleanColumn()
    isDeleted: boolean;

    /** The permissions associated with the user role. */
    @JsonbColumn()
    permissions: string[];

    /**
     * Retrieves the mapping of column names to their corresponding field names.
     * @static
     * @memberof MerchantUserRolesEntity
     * @returns {Map<string, string>} The mapping of column names to field names.
     */
    static getColumns?(): Map<string, string> {
        let map = new Map();
        map.set("id", "id");
        map.set("title", "title");
        map.set("isActive", "is_active");
        map.set("permissions", "permissions");
        return map;
    }

    /**
     * Retrieves the names of cluster columns.
     * @memberof MerchantUserRolesEntity
     * @returns {string[]} The names of cluster columns.
     */
    getClusterColumns?(): string[] {
        throw new Error("Method not implemented.");
    }

    /**
     * Retrieves the column name corresponding to the provided field name.
     * @static
     * @memberof MerchantUserRolesEntity
     * @param {string} fieldName - The field name.
     * @returns {string} The corresponding column name.
     */
    static getColumnName(fieldName: string): string {
        return this.getColumns().get(fieldName);
    }

    /**
     * Retrieves the name of the table.
     * @static
     * @memberof MerchantUserRolesEntity
     * @returns {string} The name of the table.
     */
    static getTableName?(): string {
        return `${SystemsConstant.SHARED_KEYSPACE}.merchant_user_roles`;
    }
}