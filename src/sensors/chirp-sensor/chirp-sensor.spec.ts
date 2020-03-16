import { Test, TestingModule } from '@nestjs/testing';
import { ChirpSensor } from './chirp-sensor.service';

describe('ChirpSensorService', () => {
  let service: ChirpSensor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChirpSensor],
    }).compile();

    service = module.get<ChirpSensor>(ChirpSensor);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
