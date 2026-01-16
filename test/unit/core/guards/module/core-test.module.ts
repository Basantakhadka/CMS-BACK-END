import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from 'CMS-BACK-END/src/config/index';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/config/env/test.env`],
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
  ],
})
export class TestCoreModule {}
