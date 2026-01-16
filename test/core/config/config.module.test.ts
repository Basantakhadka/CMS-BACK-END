import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';

import config from 'CMS-BACK-END/src/config/index';
import { exportProvider, getProviders } from 'CMS-BACK-END/src/core/providers';

@Global()
@Module({
    imports: [
        DiscoveryModule,
        ConfigModule.forRoot({
            envFilePath: [`${ process.cwd() }/config/env/.env`, `${ process.cwd() }/config/env/.env.${ process.env.NODE_ENV }`],
            isGlobal: true,
            expandVariables: true,
            load: config,
        }),

    ],
    providers: [...getProviders()],
    exports: [...exportProvider()],
})
export class CoreTestModule { }
