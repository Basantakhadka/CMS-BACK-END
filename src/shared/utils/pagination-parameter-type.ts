import { DynamicQueryOptions } from "@app/core/repository/query-options";

export interface IPaginationParameter {
    idField: string;
    timestampField: string;
    dynamicQueryOptions: DynamicQueryOptions;
    query: string;
}