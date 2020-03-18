import { Module } from '@nestjs/common';
import { ChirpSensorModule } from './chirp-sensor/chirp-sensor.module';
import { Hdc1000SensorModule } from './hdc-1000-sensor/hdc-1000-sensor.module';
import { Mhz16SensorModule } from './mhz-16-sensor/mhz-16-sensor.module';
import { SensorsService } from './sensors.service';
import { I2cModule } from '../i2c/i2c.module';
import { ConfigModule } from '@nestjs/config';
import Sensor from './sensor';
import {Sensor as SensorModel} from "./sensors.model";
import { TypegooseModule } from 'nestjs-typegoose';
import { SensorReading } from 'src/data-logger/sensor-reading';

@Module({
  imports: [
    ConfigModule,
    TypegooseModule.forFeature([{
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
  ]),
    ChirpSensorModule,
    I2cModule,
    Hdc1000SensorModule,
    Mhz16SensorModule
  ],
  providers: [
    SensorsService,
    Sensor
  ],
  exports: [SensorsService, Sensor]
})
export class SensorsModule {}
