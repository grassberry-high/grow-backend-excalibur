import { Module } from '@nestjs/common';
import { ChirpSensorModule } from './chirp-sensor/chirp-sensor.module';
import { Hdc1000SensorModule } from './hdc1000-sensor/hdc1000-sensor.module';
import { Mhz16SensorModule } from './mhz-16-sensor/mhz-16-sensor.module';

@Module({
  imports: [ChirpSensorModule, Hdc1000SensorModule, Mhz16SensorModule]
})
export class SensorsModule {}
