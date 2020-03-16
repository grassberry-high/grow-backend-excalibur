import * as dotenv from 'dotenv'; // ConfigModule is not importing early enough for DI
dotenv.config();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChambersModule } from './chambers/chambers.module';
import {TypegooseModule} from "nestjs-typegoose";
import { SensorsModule } from './sensors/sensors.module';
import { I2cModule } from './i2c/i2c.module';
import { SystemModule } from './system/system.module';
import { LoggerModule } from './helpers/logger/logger.module';
import SensorMock from './sensors/mocks/sensor.mock';

@Module({
  imports: [
    ChambersModule,
    TypegooseModule.forRoot('mongodb://localhost/LOC_gh',  { useNewUrlParser: true, useCreateIndex: true }),
    SensorsModule,
    I2cModule,
    SystemModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [AppService, SensorMock],
})
export class AppModule {}
