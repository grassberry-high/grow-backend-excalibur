import { Test, TestingModule } from '@nestjs/testing';
import { BsonToJsonService } from './bson-to-json.service';

describe('BsonToJsonService', () => {
  let service: BsonToJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BsonToJsonService],
    }).compile();

    service = module.get<BsonToJsonService>(BsonToJsonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
