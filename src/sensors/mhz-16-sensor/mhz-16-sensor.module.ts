import { Module } from '@nestjs/common';
import Mhz16SensorMock from './mocks/mhz-16-sensor.mock';
import { Mhz16Sensor } from './mhz-16-sensor';

const mhz16Provider = { provide: Mhz16Sensor, useFactory: () => process.env.SIMULATION === 'true' ? Mhz16SensorMock :  Mhz16Sensor };

@Module({
  providers: [mhz16Provider],
  exports: [mhz16Provider]
})
export class Mhz16SensorModule {}
