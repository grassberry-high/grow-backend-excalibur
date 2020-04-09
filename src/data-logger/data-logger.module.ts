import { Module } from '@nestjs/common';
import { DataLogger } from './data-logger';
import { TypegooseModule } from 'nestjs-typegoose';
import { Event } from './event.model';
import { SensorReading } from './sensor-reading';
import { LoggerModule } from 'src/helpers/logger/logger.module';

const models = TypegooseModule.forFeature([Event, SensorReading]);
@Module({
  imports: [models, LoggerModule],
  providers: [DataLogger],
  exports: [DataLogger, models]
})
export class DataLoggerModule {}
