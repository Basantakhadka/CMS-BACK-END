import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { DatasourceService } from "./datasource.service";

@Injectable()
export class DatabaseMiddleware implements NestMiddleware {
	private readonly logger = new Logger(DatabaseMiddleware.name);

	constructor (private readonly datasourceService: DatasourceService) { }

	async use(req: Request, res: Response, next: NextFunction) {
		try {
			// Ensure the DataSource is initialized
			await this.datasourceService.createDatasource();
			next();
		} catch (error) {
			this.logger.error("DB CONNECTION ERROR", error?.stack || error?.message);
			res.status(503).json({ message: "Service temporarily unavailable" });
		}
	}
}
