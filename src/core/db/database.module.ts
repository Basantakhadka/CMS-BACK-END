import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: "postgres",
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        schema: "institution_001",
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
