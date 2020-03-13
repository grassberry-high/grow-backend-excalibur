import { Controller, Get, Post, Body } from '@nestjs/common';
import { Sensor } from './sensor.model';
import { SensorService } from './sensor.service';

@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  getSensors(): Promise<Sensor[]> {
    return this.sensorService.getSensorsRaw();
  }

  @Post()
  addSensor(@Body() sensor: Sensor) {
    return this.sensorService.addSensor(sensor);
  }
}
