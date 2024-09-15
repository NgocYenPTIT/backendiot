import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { DatabaseService } from '../database/database.service';
import { HistorySensor } from 'src/entities/history-sensor.entity';

@Injectable()
export class MqttService implements OnModuleInit {
    private client: mqtt.MqttClient
    constructor(
        private configService: ConfigService,
        private databaseService: DatabaseService
    ) { }
    onModuleInit() {
        this.connectToMqttBroker();
    }

    connectToMqttBroker() {
        this.client = mqtt.connect(`mqtt://${this.configService.get<string>('IP')}`);

        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
            this.client.subscribe('iot_NgocYen', (err) => {
                if (err) {
                    console.error('Failed to subscribe:', err);
                }
            });
        });

        this.client.on('message', async (topic, message) => {
            // Convert message to string
            const messageString = message.toString();
            console.log(`Received message from ${topic}: ${messageString}`);

            try {
                // Parse message as JSON
                const data = JSON.parse(messageString);

                // Extract the necessary data
                const { humidity, temperature } = data;

                // Log the extracted data
                console.log('Humidity:', humidity);
                console.log('Temperature:', temperature);
                await this.databaseService.getDataSource().createEntityManager().getRepository(HistorySensor).save({ temperature, humid: humidity });
                // Do something with the data (save to database, trigger other actions, etc.)
            } catch (error) {
                console.error('Error parsing MQTT message:', error);
            }
        });
    }
}
