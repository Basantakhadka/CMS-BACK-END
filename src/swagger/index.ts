
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication, port:any) => {
  const config = app.get(ConfigService);
  const options = new DocumentBuilder()
    .setTitle(config.get('app.name'))
    .setDescription(`API Documentation for the ${config.get('app.name')}`)
    .setVersion('1.0')
    .addServer('/v1',`http://localhost:${port || 3000}/`)
    .addServer("/demo/bank-web-api/v1",`https://getpay.finpos.global/demo/bank-web-api/`)
    .addBearerAuth(
      {
        type: 'apiKey',
        name: 'X-Xsrf-Token',
        in: 'header',
        description: 'Enter X-Xsrf-Token',
      },
      'X-Xsrf-Token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
};
