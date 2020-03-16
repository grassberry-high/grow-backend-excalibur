import { Test, TestingModule } from '@nestjs/testing';
import { SystemUpdateService } from './system-update.service';

describe('SystemUpdateService', () => {
  let service: SystemUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemUpdateService],
    }).compile();

    service = module.get<SystemUpdateService>(SystemUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
