import { AppController } from "CMS-BACK-END/src/app.controller";
import { CoreModule } from "CMS-BACK-END/src/core/module";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "./core/auth/JwtStrategy";
import { TokenIntegrityValidator } from "./core/auth/tokenIntegrityValidator";
import { CacheModule as CustomCacheModule } from "./core/cache/cache.module";
import { DatabaseMiddleware } from "./core/db/database.middleware";
import { DatabaseModule } from "./core/db/database.module";
import { DataSourceModule } from "./core/db/datasource.module";
import { RequestContextMiddleware } from "./core/middleware/RequestContextMiddleware";
import { AlsModule } from "./core/middleware/als.module";
import { NotificationModule } from "./core/notification/notification.module";
import { OtpModule } from "./core/otp/otp.module";
import { AuthModule } from "./feature/auth/auth.module";
import { IdentityAndAccessModule } from "./feature/identity-access/identity-access.module";
import { ContractsModule } from "./feature/contracts/contracts.module";

import { entities } from "./shared/entities";
import { AppService } from "./app.service";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
	imports: [
		DataSourceModule,
		OtpModule,
		DatabaseModule,
		TypeOrmModule.forFeature(entities),
		AlsModule,
		CoreModule,
		AuthModule,
		NotificationModule,
		CustomCacheModule,
		IdentityAndAccessModule,
		ContractsModule,
		EventEmitterModule.forRoot()
	],
	controllers: [AppController],
	providers: [AppService, JwtStrategy, TokenIntegrityValidator],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RequestContextMiddleware).forRoutes("*");
		consumer.apply(DatabaseMiddleware).forRoutes("*");
	}
}
