export interface ISheetOptions {
  summaryDetails: Array<Array<string | number>>;
  header: Array<Array<string | number>>;
  footer?: Array<string | number>;
  isTransaction?: boolean;
}
