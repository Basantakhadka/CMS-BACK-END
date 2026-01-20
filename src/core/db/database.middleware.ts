import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
	NestMiddleware,
} from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { NextFunction, Request, Response } from "express";
import { RequestContext } from "../middleware/request_context";
import { DatasourceService } from "./datasource.service";
import { SystemsConstant } from "../constants/systems.constant";
import { DatabaseException } from "../exception/database.exception";

@Injectable()
export class DatabaseMiddleware implements NestMiddleware {
	constructor(
		@Inject(DatasourceService) private datasourceService: DatasourceService,
		private readonly als: AsyncLocalStorage<RequestContext>
	) {}
	async use(req: Request, res: Response, next: NextFunction) {
		const schema = this.als.getStore()["currentUser"].schema;
		if (req.originalUrl.includes("login")) {
			let schemas: any;
			try {
				schemas = await this.datasourceService.connections[
					SystemsConstant.SHARED_KEYSPACE
				];
			} catch (error) {
				Logger.error("DB CONNECTION ERROR", error?.message);
				throw new DatabaseException("Service temporarily unavailable");
			}
			const isSchemaExist = schemas.some((s) => s.schema === schema);
			if (!isSchemaExist) {
				throw new BadRequestException("Invalid credentials");
			}
		}
		await this.datasourceService.createDatasource(schema);
		next();
	}
}
