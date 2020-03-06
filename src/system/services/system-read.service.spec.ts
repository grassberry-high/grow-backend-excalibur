import { Test, TestingModule } from '@nestjs/testing';
import { SystemReadService } from './system-read.service';

describe('SystemReadService', () => {
  let service: SystemReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemReadService],
    }).compile();

    service = module.get<SystemReadService>(SystemReadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
