import { entities } from "@app/shared/entities";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { RequestContext } from "../middleware/request_context";
import { SystemsConstant } from "../constants/systems.constant";

type Entity<T extends ObjectLiteral> = new (...args: any[]) => T;
export interface CustomRepository<T> extends Repository<T> {
  schema?: string;
}
@Injectable()
export class DatasourceService implements OnModuleInit {
  constructor(private readonly als: AsyncLocalStorage<RequestContext>) {}
  connections: Record<string, DataSource> = {};
  async onModuleInit() {
    await this.createDatasource(SystemsConstant.SHARED_KEYSPACE);
  }
  async createDatasource(schema: string) {
    try {
      const dataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        schema,
        name: schema,
        entities: entities,
        namingStrategy: new SnakeNamingStrategy(),
      });
      if (!this.connections[schema]) {
        this.connections[schema] = dataSource;
        await this.connections[schema].initialize();
      }
      return this.connections[schema];
    } catch (err) {
      const errorTimeout = setInterval(async () => {
        Logger.error(
          `Database connection failed for schema ${schema}! -- ${err.name} - ${err.message}`
        );
      }, 2000);
      setTimeout(() => {
        clearTimeout(errorTimeout);
      }, 10000);
    }
  }

  async getRepository<T extends ObjectLiteral>(
    entity: Entity<T>,
    schema?: string
  ) {
    const contextSchema = schema || this.als.getStore()["currentUser"].schema;
    console.log({schema})
    if (!this.connections[contextSchema]) {
      await this.createDatasource(contextSchema);
    }
    const respository: CustomRepository<T> =
      this.connections[contextSchema].getRepository<T>(entity);
    respository.schema = contextSchema;
    return respository;
  }
  async getDataSources() {
    return this.connections;
  }
}
