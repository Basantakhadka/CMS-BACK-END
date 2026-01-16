import { ReadStream } from "typeorm/platform/PlatformTools";
import * as ExcelJS from "exceljs";
import { ISheetOptions } from "./interface/sheet-generation.interface";
import { TransactionType } from "../constants/transaction-type.constant";
import { PaymentStatus } from "../constants/payment-status.constant";
import { PaymentPoints } from "../constants/payment-points.constant";
import { PaymentMode } from "../constants/payment-mode.constant";
import { TransactionMode } from "../constants/transaction-mode.constant";
import { NetworksConstant } from "../constants/networks.constant";
import { ISheetGenerationSettings } from "./interface/sheet-generation.settings";

export class SheetGenerationService {
	public workbook: ExcelJS.stream.xlsx.WorkbookWriter;
	constructor(public stream?: ReadStream, public filename?: string) {
		this.workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
			filename: filename,
			useStyles: true,
		});
	}
	async generateExcelBook(
		sheetName: string,
		sheetOptions: ISheetOptions,
		transformData: (data: any,index?:number) => Array<any>,
		sheetSettings?: ISheetGenerationSettings
	) {
		const worksheet = this.workbook.addWorksheet(sheetName || "");
		let index = 1;
		const response = await new Promise((resolve, reject) => {
			this.addSheetSummary(worksheet, sheetOptions.summaryDetails);
			this.addHeader(worksheet, sheetOptions.header);
			this.stream.on("data", (individualData) => {
				if (sheetOptions.isTransaction) {
					this.addTransctionData(worksheet,
						transformData(individualData,index),
					 );
				} else {
					this.addListData(worksheet, [
						index,
						...transformData(individualData,index),
					]);
					
				}
				index++;
			});
			this.stream.on("end", () => {
				sheetOptions.footer && this.addFooter(worksheet, sheetOptions.footer);
				console.log("End of Stream");
				resolve(true);
			});
			this.stream.on("error", (err) => {
				console.log("Error on Stream", err);
				reject(err);
			});
		});
		await this.workbook.commit();

		return response;
	}
	public addSheetSummary(
		worksheet: ExcelJS.Worksheet,
		summaryDetails: Array<Array<string | number>>
	) {
		summaryDetails?.forEach((element: Array<string | number>) => {
			worksheet
				.addRow(element)
				.eachCell({ includeEmpty: true }, (cell, colNum) => {
					if (colNum == 1) {
						cell.font = { bold: true };
						cell.alignment = { vertical: "bottom", horizontal: "right" };
					}
				});
		});
	}
	public addHeader(
		worksheet: ExcelJS.Worksheet,
		headers: Array<Array<string | number>>
	) {
		headers.forEach((header: Array<string>) => {
			worksheet.addRow(header).eachCell((cell, colNum) => {
				worksheet.getColumn(colNum).width = 20;
				cell.alignment = { vertical: "middle", horizontal: "left" };
				cell.font = { bold: true };
				cell.border = {
					top: { style: "thin" },
					left: { style: "thin" },
					bottom: { style: "thin" },
					right: { style: "thin" },
				};
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "CEE2F2" },
				};
			});
		});
	}
	public addListData(
		worksheet: ExcelJS.Worksheet,
		data: Array<string | number>,
		verticalAlignment:
			| "bottom"
			| "top"
			| "middle"
			| "distributed"
			| "justify" = "middle",
		horizontalAlignment:
			| "distributed"
			| "justify"
			| "right"
			| "left"
			| "center"
			| "fill"
			| "centerContinuous" = "right"
	) {
		worksheet.addRow(data).eachCell({ includeEmpty: true }, (cell) => {
			cell.alignment = {
				vertical: verticalAlignment,
				horizontal: horizontalAlignment,
			};
			cell.border = {
				top: { style: "thin" },
				left: { style: "thin" },
				bottom: { style: "thin" },
				right: { style: "thin" },
			};
		});
	}
	public addFooter(
		worksheet: ExcelJS.Worksheet,
		footer: Array<string | number>
	) {
		worksheet.addRow(footer).eachCell((cell) => {
			cell.alignment = { vertical: "middle", horizontal: "right" };
			cell.font = { bold: true };
			cell.border = {
				top: { style: "thin" },
				left: { style: "thin" },
				bottom: { style: "thin" },
				right: { style: "thin" },
			};
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "CEE2F2" },
			};
		});
	}
	public getWorkSheetBySheetName(sheetIndex: number) {
		return this.workbook.getWorksheet(sheetIndex);
	}

	public addTransctionData(
		worksheet: ExcelJS.Worksheet,
		data: Array<Array<string|number>>,
		verticalAlignment:
			| "bottom"
			| "top"
			| "middle"
			| "distributed"
			| "justify" = "middle",
		horizontalAlignment:
			| "distributed"
			| "justify"
			| "right"
			| "left"
			| "center"
			| "fill"
			| "centerContinuous" = "right"
	) {
		data?.forEach((element: Array<string | number>,index:number) => {
			worksheet.addRow(element).eachCell({ includeEmpty: true }, (cell) => {
				if (index === 0) {
					cell.border = {
						top: { style: "thin" },
					};
				}
				cell.alignment = { vertical: "middle", horizontal: "right" };
			});
		}
		);
	}
}
