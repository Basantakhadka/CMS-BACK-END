import { DynamicQueryOptions } from "CMS-BACK-END/src/core/repository/query-options";

export interface IPaginationParameter {
    idField: string;
    timestampField: string;
    dynamicQueryOptions: DynamicQueryOptions;
    query: string;
}