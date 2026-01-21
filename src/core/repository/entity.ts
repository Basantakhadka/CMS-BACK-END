export interface DbEntity {
	getColumns?: () => Map<string, string>;
	getClusterColumns?: () => string[];
	getTableName?: () => string;
}

export interface DbView {
	getColumns?: () => Map<string, string>;
	getClusterColumns?: () => string[];
	getViewName?: () => string;
}