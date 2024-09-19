import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { appDocsConfiguration } from './config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExceptionInterceptor } from './exceptionFilter/exception.intercepter';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);


  if (process.env.NODE_ENV === 'development') appDocsConfiguration(app);
  app.useGlobalInterceptors(new ExceptionInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    origin: 'http://localhost:3000',
    credentials: true
  });
  await app.listen(configService.get<string>('PORT'), '0.0.0.0');

  const serverUrl = await app.getUrl();
  Logger.log(`Server is dancing at: ${serverUrl}`);
  Logger.log(`API documentation has been generated, please visit: ${serverUrl}/swagger-api/`);
}
bootstrap();



