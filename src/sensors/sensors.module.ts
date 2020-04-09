import { Module, Global } from '@nestjs/common';
import { ChirpSensorModule } from './chirp-sensor/chirp-sensor.module';
import { Hdc1000SensorModule } from './hdc-1000-sensor/hdc-1000-sensor.module';
import { Mhz16SensorModule } from './mhz-16-sensor/mhz-16-sensor.module';
import { SensorsService } from './sensors.service';
import { I2cModule } from '../i2c/i2c.module';
import { ConfigModule } from '@nestjs/config';
import {Sensor as SensorModel} from "./sensors.model";
import { TypegooseModule } from 'nestjs-typegoose';
import { SensorReading } from 'src/data-logger/sensor-reading';
import { SystemModule } from 'src/system/system.module';
import { ChirpSensor } from './chirp-sensor/chirp-sensor';
import { Hdc1000Sensor } from './hdc-1000-sensor/hdc-1000-sensor';
import { Mhz16Sensor } from './mhz-16-sensor/mhz-16-sensor';
import { LoggerModule } from 'src/helpers/logger/logger.module';

const models = TypegooseModule.forFeature([{
  typegooseClass: SensorModel,
  schemaOptions: {
    collection: "sensors"
  }
},
{
  typegooseClass: SensorReading,
  schemaOptions: {
    collection: "sensor-readings"
  }
}
]);

@Global()
@Module({
  imports: [
    SystemModule,
    ConfigModule,
    models,
    ChirpSensorModule,
    I2cModule,
    Hdc1000SensorModule,
    Mhz16SensorModule,
    LoggerModule
  ],
  providers: [
    SensorsService,
    ChirpSensor,
    Hdc1000Sensor,
    Mhz16Sensor
  ],
  exports: [SensorsService, models, ChirpSensor, Hdc1000Sensor, Mhz16Sensor]
})
export class SensorsModule {}
