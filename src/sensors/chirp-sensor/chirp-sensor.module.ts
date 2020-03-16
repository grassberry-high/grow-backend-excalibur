import { Module } from '@nestjs/common';
import { ChirpSensor } from './chirp-sensor';
import ChirpSensorMock from './mocks/chirp-sensor.mock';


const chirpFactory = { provide: ChirpSensor, useFactory: () => process.env.SIMULATION === 'true' ? ChirpSensorMock :  ChirpSensor };

@Module({
  providers: [chirpFactory],
  exports: [chirpFactory]
})
export class ChirpSensorModule {}
