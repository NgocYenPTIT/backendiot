import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

export const appDocsConfiguration = (app: NestExpressApplication) => {
  const options = new DocumentBuilder()
    .setTitle('API v1')
    .setVersion('1')
    // .addBearerAuth(
    //     { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
    //     'access_token',
    // )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-api', app, document);
  // app.useStaticAssets(join(__dirname, '../../docs/typedoc'), { prefix: '/wiki' });
};
