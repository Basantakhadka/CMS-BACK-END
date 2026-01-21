import { DbView } from "@app/core/repository/entity";

export class PermissionsByRolesView implements DbView {
    permissions: Array<string>;
    deleted: boolean;
    active: boolean;

    static getColumns?(): Map<string, string> {
        let map = new Map();
        map.set("permissions", "permissions");
        map.set("deleted", "deleted");
        map.set("active", "active");

        return map;
    }

    static getColumnName?(fieldName: string):string {
        return this.getColumns().get(fieldName);
    }
    
    getClusterColumns?(): string[] {
        throw new Error("Method not implemented.");
    }

    static getViewName?(): string{
        throw new Error("Method not implemented.");
    };
}