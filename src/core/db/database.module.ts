import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SystemsConstant } from '../constants/systems.constant';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      schema: SystemsConstant.SHARED_KEYSPACE,
      namingStrategy: new SnakeNamingStrategy(),
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
    })

  ],
})
export class DatabaseModule { }
