import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { entities } from '@app/shared/entities';

type Entity<T extends ObjectLiteral> = new (...args: any[]) => T;

export interface CustomRepository<T> extends Repository<T> {
  schema: string;
}

@Injectable()
export class DatasourceService implements OnModuleInit {
  private dataSource: DataSource;
  private readonly schema = 'cms_portal'; // <-- your single schema

  async onModuleInit() {
    await this.initializeDatasource();
  }

  /**
   * Initialize the single DataSource if not already initialized
   */
  private async initializeDatasource(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    try {
      this.dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,

        schema: this.schema,
        name: this.schema, // DataSource name (optional if single schema)

        entities,
        namingStrategy: new SnakeNamingStrategy(),

        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',
      });

      await this.dataSource.initialize();
      Logger.log(`Connected to PostgreSQL schema: ${ this.schema }`);

      return this.dataSource;
    } catch (err) {
      Logger.error(`Database connection failed for schema ${ this.schema }`, err.stack);
      throw err;
    }
  }

  /**
   * Get repository for an entity
   */
  async getRepository<T extends ObjectLiteral>(
    entity: Entity<T>,
  ): Promise<CustomRepository<T>> {
    const ds = await this.initializeDatasource();
    const repository = ds.getRepository<T>(entity) as CustomRepository<T>;
    repository.schema = this.schema;
    return repository;
  }

  /**
   * Get the DataSource instance
   */
  getDataSource(): DataSource {
    if (!this.dataSource?.isInitialized) {
      throw new Error('Datasource not initialized yet');
    }
    return this.dataSource;
  }

  /**
   * Create or return the initialized DataSource
   * For middleware usage
   */
  async createDatasource(): Promise<DataSource> {
    return await this.initializeDatasource();
  }
}
