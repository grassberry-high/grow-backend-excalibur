import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';

@Module({
  providers: [SensorService],
  controllers: [SensorController]
})
export class SensorModule {}
