import { Test, TestingModule } from '@nestjs/testing';
import { SystemSupportService } from './system-support.service';

describe('SystemSupportService', () => {
  let service: SystemSupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemSupportService],
    }).compile();

    service = module.get<SystemSupportService>(SystemSupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
