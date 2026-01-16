export class SortMeta {
  field: string;
  order: SortOrder;

  constructor(field: string, order: SortOrder) {
    this.field = field;
    this.order = order;
  }
}
export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
