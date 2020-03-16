import { Module } from '@nestjs/common';
import { ChirpSensorModule } from './chirp-sensor/chirp-sensor.module';
import { Hdc1000SensorModule } from './hdc-1000-sensor/hdc-1000-sensor.module';
import { Mhz16SensorModule } from './mhz-16-sensor/mhz-16-sensor.module';
import { SensorsService } from './sensors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema } from './schemas/sensor.schema';
import { I2cModule } from '../i2c/i2c.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Sensor', schema: SensorSchema }]),
    ChirpSensorModule,
    I2cModule,
    Hdc1000SensorModule,
    Mhz16SensorModule
  ],
  providers: [
    SensorsService
  ],
  exports: [SensorsService]
})
export class SensorsModule {}
