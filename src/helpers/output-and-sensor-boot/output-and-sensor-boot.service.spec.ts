import { Test, TestingModule } from '@nestjs/testing';
import { OutputAndSensorBootService } from './output-and-sensor-boot.service';

describe('OutputAndSensorBootService', () => {
  let service: OutputAndSensorBootService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutputAndSensorBootService],
    }).compile();

    service = module.get<OutputAndSensorBootService>(OutputAndSensorBootService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
