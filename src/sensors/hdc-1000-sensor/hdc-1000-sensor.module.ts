import { Module } from '@nestjs/common';
import { Hdc1000Sensor } from './hdc-1000-sensor';
import Hdc1000SensorMock from './mocks/hdc-1000-sensor.mock';
import { SystemReadService } from 'src/system/services/system-read.service';
import { LoggerService } from 'src/helpers/logger/logger.service';
import { SystemModule } from 'src/system/system.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { System } from 'src/system/system.model';

const hdc1000Provider = { provide: Hdc1000Sensor, useFactory: () => process.env.SIMULATION === 'true' ? Hdc1000SensorMock : Hdc1000Sensor };

@Module({
  providers: [hdc1000Provider],
  exports: [hdc1000Provider]
})
export class Hdc1000SensorModule {}
