import { Global, Module } from "@nestjs/common";
import { DatasourceService } from "./datasource.service";

@Global()
@Module({
	imports: [],
	providers: [DatasourceService],
	exports: [DatasourceService],
})
export class DataSourceModule {}
