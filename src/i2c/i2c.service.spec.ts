import { Test, TestingModule } from '@nestjs/testing';
import { I2cService } from './i2c.service';

describe('I2cService', () => {
  let service: I2cService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [I2cService],
    }).compile();

    service = module.get<I2cService>(I2cService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
