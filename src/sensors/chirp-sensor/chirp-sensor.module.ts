import { Module } from '@nestjs/common';
import { ChirpSensorService } from './chirp-sensor.service';

@Module({
  providers: [ChirpSensorService]
})
export class ChirpSensorModule {}
