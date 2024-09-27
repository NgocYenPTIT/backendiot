import {
  BadRequestException,
  Injectable,
  Logger,
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
import {
  betweenQuery,
  betweenQuery2,
  convertDate,
  convertDate2,
} from 'src/constant/http-status.constant';
@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) { }
  onModuleInit() {
    this.connectToMqttBroker();
  }

  connectToMqttBroker() {
    this.client = mqtt.connect(
      `mqtt://${this.configService.get<string>('IP')}`,
      {
        username: this.configService.get<string>('MQTT_USERNAME'),
        password: this.configService.get<string>('MQTT_PASSWORD'),
      }
    );

    this.client.on('connect', () => {
      Logger.log('Connected to MQTT broker');
      this.client.subscribe('iot_NgocYen', (err) => {
        if (err) {
          console.error('Failed to subscribe:', err);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      // Convert message to string
      const messageString = message.toString();
      Logger.log(`Received message from ${topic}: ${messageString}`);

      try {
        const data = JSON.parse(messageString);

        const changeSuccess = data?.changeSuccess;
        if (changeSuccess) {// topic change action
          const tmp = {
            fan: 'Không đổi',
            light: 'Không đổi',
            ac: 'Không đổi',
          };
          if (data?.device === 'fan') tmp.fan = data.status;
          if (data?. device === 'light') tmp.light = data.status;
          if (data?.device === 'ac') tmp.ac = data.status;
          await this.databaseService.getDataSource().getRepository(HistoryAction).save(tmp);
          return;
        }

        // topic for curent status
        const { humidity, temperature, lux } = data;

        if (humidity !== null && humidity !== undefined && temperature !== null && temperature !== undefined && lux !== null && lux !== undefined
        )
          await this.databaseService
            .getDataSource()
            .createEntityManager()
            .getRepository(HistorySensor)
            .save({ temperature: temperature.toFixed(2), humid: humidity.toFixed(2), light: lux.toFixed(2) });
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });
  }
  async getHistorySensor(query: GetHistorytCensorDto) {
    const { pageSize, currentPage, temperature, humid, light, time } = query;
    const searchQuery: any = {};

    if (temperature !== null && temperature != undefined)
      searchQuery.temperature = temperature;
    if (humid !== null && humid != undefined) searchQuery.humid = humid;
    if (light !== null && light != undefined) searchQuery.light = light;
    let whereBetween = '';
    if (time !== undefined && time !== null && !convertDate(time))
      throw new BadRequestException('Thời gian không phù hợp');
    else if (time !== undefined && time !== null && convertDate(time))
      whereBetween = betweenQuery(convertDate(time));
    else whereBetween = '1=1';
    const [results, total] = await this.databaseService
      .getDataSource()
      .getRepository(HistorySensor)
      .createQueryBuilder()
      .where(searchQuery)
      .andWhere(whereBetween)
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .orderBy('HistorySensor.createdAt', 'DESC')
      .getManyAndCount();
    return { results, total };
  }

  async getHistoryAction(query: GetHistorytActionDto) {
    const { pageSize, currentPage, time } = query;
    let whereBetween = '';
    if (time !== undefined && time !== null && !convertDate2(time))
      throw new BadRequestException('Thời gian không phù hợp');
    else if (time !== undefined && time !== null && convertDate2(time))
      whereBetween = betweenQuery2(convertDate2(time));
    else whereBetween = '1=1';
    console.log(whereBetween);
    const [results, total] = await this.databaseService
      .getDataSource()
      .getRepository(HistoryAction)
      .createQueryBuilder()
      .where(whereBetween)
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .orderBy('HistoryAction.createdAt', 'DESC')
      .getManyAndCount();
    return { results, total };
  }
  async changeStatusDevice(body: ChangeStatusDeviceDto) {
    const { device, status } = body;

    if (device !== 'fan' && device !== 'light' && device !== 'ac') throw new BadRequestException('Tên thiết bị không phù hợp');
    if (status !== 'on' && status !== 'off') throw new BadRequestException('Trạng thái không phù hợp');

    const message = JSON.stringify({
      device, action: status, action_from_nodeJS: true,
    });
    this.client.publish('iot_NgocYen', message, (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
        throw new Error('Publish to MQTT failed');
      } else {
        console.log('Message published:', message);
      }
    });

    return { success: true };
  }

  async getStatusDevices() {
    const fan = await this.databaseService
      .getDataSource()
      .getRepository(HistoryAction)
      .findOne({
        where: {
          fan: Not('Không đổi'),
        },
        select: ['fan'],
        order: { id: 'desc' },
      });
    const light = await this.databaseService
      .getDataSource()
      .getRepository(HistoryAction)
      .findOne({
        where: {
          light: Not('Không đổi'),
        },
        select: ['light'],
        order: { id: 'desc' },
      });

    const ac = await this.databaseService
      .getDataSource()
      .getRepository(HistoryAction)
      .findOne({
        where: {
          ac: Not('Không đổi'),
        },
        select: ['ac'],
        order: { id: 'desc' },
      });
    return {
      fan: fan?.fan === 'on' ? true : false,
      ac: ac?.ac === 'on' ? true : false,
      light: light?.light === 'on' ? true : false,
    };
  }



  async getLatestStatus() {
    const top = 12;
    const data = await this.databaseService
      .getDataSource()
      .getRepository(HistorySensor)
      .find({
        take: top,
        order: { id: 'desc' },
      });
    return data;
  }

  async changeStatusDevicee(body: any) {
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

    const message = JSON.stringify({
      device,
      action: status,
      action_from_nodeJS: true,
    });

    // Gửi message tới topic 'iot_NgocYen'
    this.client.publish('iot_NgocYen', message, (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
        throw new Error('Publish to MQTT failed');
      } else {
        console.log('Message published:', message);
      }
    });

    // Lắng nghe phản hồi từ topic 'iot_NgocYen/response'
    this.client.subscribe('iot_NgocYen/response', (err) => {
      if (err) {
        console.error('Failed to subscribe to response topic:', err);
        throw new Error('Subscribe to MQTT topic failed');
      }
    });

    // Xử lý phản hồi
    return new Promise((resolve, reject) => {
      this.client.on('message', async (topic, payload) => {
        if (topic === 'iot_NgocYen') {
          const response = JSON.parse(payload.toString());

          // Kiểm tra phản hồi có thành công không
          if (response.status === 'success') {
            // Lưu vào cơ sở dữ liệu nếu phản hồi là success
            await this.databaseService.getDataSource().getRepository(HistoryAction).save(tmp);
            resolve({ success: true });
          } else {
            reject(new Error('Device action failed'));
          }
        }
      });
    });
  }
}


