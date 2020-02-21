import { Test, TestingModule } from '@nestjs/testing';
import { ChambersService } from './chambers.service';

describe('ChambersService', () => {
  let service: ChambersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChambersService],
    }).compile();

    service = module.get<ChambersService>(ChambersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
