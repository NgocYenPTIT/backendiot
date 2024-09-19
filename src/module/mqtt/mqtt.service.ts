import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { DatabaseService } from '../database/database.service';
import { HistorySensor } from 'src/entities/history-sensor.entity';
import { GetHistorytCensorDto } from './dto/get-history-sensor.dto';
import { HistoryAction } from 'src/entities/history-action.entity';
import { GetHistorytActionDto } from './dto/get-history-action.dto';
import { ChangeStatusDeviceDto } from './dto/change-status-device.dto';
import { Not } from 'typeorm';
const parseData = (s: string) => {

  // Tách chuỗi thành các phần
  const [datePart, timePart] = s.split(' ');
  const [day, month, year] = datePart.split('-');
  const [hours, minutes, seconds] = timePart.split(':');

  // Tạo đối tượng Date
  const dateObj = new Date(year as unknown as number, month as unknown as number - 1, day as unknown as number, hours as unknown as number, minutes as unknown as number, seconds as unknown as number);
  const milliseconds = dateObj.getTime() + (7 * 60 * 60 * 1000);

  const ans = new Date(milliseconds);
  console.log(ans);
  return ans;


}
function isValidFormat(s) {
  // Định dạng: "DD-MM-YYYY HH:mm:ss"
  const dateTimeRegex = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/;

  // Định dạng: "DD-MM-YYYY"
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

  // Kiểm tra xem chuỗi có khớp với một trong hai định dạng hay không
  return dateTimeRegex.test(s) || dateRegex.test(s);
}
@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) { }
  async getHistorySensor(query: GetHistorytCensorDto) {
    const { pageSize, currentPage, temperature, humid, light, time } = query;
    const searchQuery: any = {};

    if (temperature) searchQuery.temperature = temperature;
    if (humid) searchQuery.humid = humid;
    if (light) searchQuery.light = light;

    if (time && !isValidFormat(time)) throw new BadRequestException('Thời gian không phù hợp');
    if (time) searchQuery.createdAt = parseData(time);
    const [results, total] = await this.databaseService
      .getDataSource()
      .getRepository(HistorySensor)
      .findAndCount({
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        where: searchQuery
      });
    return { results, total };
  }

  async getHistoryAction(query: GetHistorytActionDto) {
    const { pageSize, currentPage } = query;
    const [results, total] = await this.databaseService
      .getDataSource()
      .getRepository(HistoryAction)
      .findAndCount({
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
      });
    return { results, total };
  }
  async changeStatusDevice(body: ChangeStatusDeviceDto) {
    const { device, status } = body;
    const tmp = {
      fan: 'Không đổi',
      light: 'Không đổi',
      ac: 'Không đổi',
    };
    if (device === 'fan') tmp.fan = status;
    if (device === 'light') tmp.light = status;
    if (device === 'ac') tmp.ac = status;

    if (device !== 'fan' && device !== 'light' && device !== 'ac')
      throw new BadRequestException('Tên thiết bị không phù hợp');
    if (status !== 'on' && status !== 'off')
      throw new BadRequestException('Trạng thái không phù hợp');

    const message = JSON.stringify({ device, action: status, action_from_nodeJS: true });
    this.client.publish('iot_NgocYen', message, (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
        throw new Error('Publish to MQTT failed');
      } else {
        console.log('Message published:', message);
      }
    });

    await this.databaseService
      .getDataSource()
      .getRepository(HistoryAction)
      .save(tmp);

    return { success: true };
  }

  async getStatusDevices() {
    const fan = await this.databaseService.getDataSource().getRepository(HistoryAction)
      .findOne({
        where: {
          fan: Not('Không đổi')
        },
        select: ['fan'],
        order: { id: 'desc' }
      });
    const light = await this.databaseService.getDataSource().getRepository(HistoryAction)
      .findOne({
        where: {
          light: Not('Không đổi')
        },
        select: ['light'],
        order: { id: 'desc' }
      });
    const ac = await this.databaseService.getDataSource().getRepository(HistoryAction)
      .findOne({
        where: {
          ac: Not('Không đổi')
        },
        select: ['ac'],
        order: { id: 'desc' }
      });
    return { fan: fan.fan === 'on' ? true : false, ac: ac.ac === 'on' ? true : false, light: light.light === 'on' ? true : false };
  }




  onModuleInit() {
    // this.connectToMqttBroker();
  }

  connectToMqttBroker() {
    this.client = mqtt.connect(
      `mqtt://${this.configService.get<string>('IP')}`,
    );

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
        // lack light
        if (humidity && temperature) await this.databaseService
          .getDataSource()
          .createEntityManager()
          .getRepository(HistorySensor)
          .save({ temperature, humid: humidity });
        // Do something with the data (save to database, trigger other actions, etc.)
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });
  }
}
