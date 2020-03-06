import { Test, TestingModule } from '@nestjs/testing';
import { ChirpSensorService } from './chirp-sensor.service';

describe('ChirpSensorService', () => {
  let service: ChirpSensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChirpSensorService],
    }).compile();

    service = module.get<ChirpSensorService>(ChirpSensorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
