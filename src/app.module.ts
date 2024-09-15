import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './module/mqtt/mqtt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MqttModule,
    ConfigModule.forRoot({
      envFilePath: ['./.env'],
      isGlobal : true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
