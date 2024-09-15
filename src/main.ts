import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  Logger.log(`App is listening in port ${process.env.PORT}`);
  const configService = app.get(ConfigService);
  console.log(`mqtt://${configService.get<string>('PORT')}`)
}
bootstrap();
