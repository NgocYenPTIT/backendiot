import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { HttpStatusCodeDescription } from '../../constant/http-status.constant';
import { GetHistorytCensorDto } from './dto/get-history-sensor.dto';
import { GetHistorytActionDto } from './dto/get-history-action.dto';
import { ChangeStatusDeviceDto } from './dto/change-status-device.dto';
@ApiTags('MQTT')
@ApiInternalServerErrorResponse({
  description: HttpStatusCodeDescription.INTERNAL_SERVER_ERROR,
})
@ApiBadRequestResponse({ description: HttpStatusCodeDescription.BAD_REQUEST })
@ApiUnprocessableEntityResponse({
  description: HttpStatusCodeDescription.UNPROCESSABLE_ENTITY,
})
@ApiOkResponse({ description: HttpStatusCodeDescription.SUCCESS })
@ApiNotFoundResponse({ description: HttpStatusCodeDescription.NOT_FOUND })
@Controller('/mqtt')
export class MqttController {
  constructor(private readonly mqttService: MqttService) { }

  @Get('/history-sensors')
  @ApiOperation({ summary: 'Get list status of history sensor' })
  async getHistorySensor(@Query() query: GetHistorytCensorDto) {
    return this.mqttService.getHistorySensor(query);
  }

  @Get('/history-actions')
  @ApiOperation({ summary: 'Get list status of history action' })
  async getHistoryAction(@Query() query: GetHistorytActionDto) {
    return this.mqttService.getHistoryAction(query);
  }
  @Post('/change-status-device')
  @ApiOperation({ summary: 'Change status device' })
  async changeStatusDevice(@Body() body: ChangeStatusDeviceDto) {
    return this.mqttService.changeStatusDevice(body);
  }

  @Get('/status-devices')
  @ApiOperation({ summary: 'Get  current status of ac , light and fan' })
  async getStatusDevices() {
    return this.mqttService.getStatusDevices();
  }

  @Get('/top-latest-status')
  @ApiOperation({ summary: 'Get top latest status of temperature , humidity , light' })
  async getLatestStatus() {
    return this.mqttService.getLatestStatus();
  }
}
