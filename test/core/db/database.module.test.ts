import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => ({
                type: "postgres",
                host: process.env.TEST_DB_HOST,
                port: +process.env.TEST_DB_PORT,
                username: process.env.TEST_DB_USER,
                password: process.env.TEST_DB_PASSWORD,
                database: process.env.TEST_DB_NAME,
                autoLoadEntities: true,
                namingStrategy: new SnakeNamingStrategy(),
                synchronize: false,
            }),
        }),
    ],
})
export class DatabaseTestModule { }
