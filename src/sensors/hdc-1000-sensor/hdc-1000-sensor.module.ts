import { Module } from '@nestjs/common';
import { Hdc1000Sensor } from './hdc-1000-sensor';
import Hdc1000SensorMock from './mocks/hdc-1000-sensor.mock';

const hdc1000Provider = { provide: Hdc1000Sensor, useFactory: () => process.env.SIMULATION === 'true' ? Hdc1000SensorMock : Hdc1000Sensor };

@Module({
  providers: [hdc1000Provider],
  exports: [hdc1000Provider]
})
export class Hdc1000SensorModule {}
