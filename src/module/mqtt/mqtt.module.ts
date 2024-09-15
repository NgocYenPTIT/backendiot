import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { DatabaseModule } from '../database/database.module';
@Module({
    imports: [DatabaseModule],
    controllers: [MqttController],
    providers: [MqttService],
    exports: [MqttService]
})
export class MqttModule { }
