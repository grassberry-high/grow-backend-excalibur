import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import {TypegooseModule} from "nestjs-typegoose";
import { Sensor } from './sensor.model';

@Module({
  imports: [
    TypegooseModule.forFeature([Sensor])
  ],
  providers: [SensorService],
  controllers: [SensorController]
})
export class SensorModule {}